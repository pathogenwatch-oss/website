// You run this like this:
// NODE_PATH=/pathogenwatch/node_modules:/pathogenwatch/src time node bin/data-import/client.js 58ac0e13c492e60001aa083f

const { URL } = require('url');
const https = require('https');
const fetch = require('node-fetch');
const mongoose = require('mongoose');

const mongoConnection = require('utils/mongoConnection');
const Genome = require('models/genome');
const Analysis = require('models/analysis');
const fastaStore = require('utils/fasta-store');

const Pool = require('./concurrentWorkers');
const { b64encode, hashGenome } = require('./common');
const { name, pass, baseUrl: _url } = require('./env.json');

const { ObjectId } = mongoose.Types;

const baseUrl = new URL(_url);
const httpsAgent = new https.Agent({
  keepAlive: true,
});

const authHeaders = {
  Authorization: `Basic ${b64encode(`${name}:${pass}`)}`,
};

function sleep(t) {
  return new Promise((r) => setTimeout(r, t));
}

const DEBUG = process.env.DEBUG === 'true';
const MAX_RETRIES = DEBUG ? 1 : 5;
if (DEBUG) console.log({ DEBUG });

async function request(path, args = {}) {
  const url = `${baseUrl.origin}${baseUrl.pathname.replace(/\/+/g, '/')}${path}${baseUrl.search}`;
  const { headers: originalHeaders = {} } = args;

  const updatedArgs = {
    ...args,
    headers: { ...originalHeaders, ...authHeaders },
    agent: httpsAgent,
    timeout: path.includes('/status') ? 90000 : 3000,
  };

  let r;
  let error;
  for (let retry = 0; retry < MAX_RETRIES; retry++) {
    try {
      // if (DEBUG) console.log({ retry, url, method: args.method });
      r = await fetch(url, updatedArgs);
      if (r.status >= 200 && r.status < 500) return r;
    } catch (e) {
      error = e;
    }
    await sleep(2000);
  }
  if (DEBUG) console.log({ error, r });
  if (error !== undefined) throw error;
  return r;
}

function postJson(path, data) {
  return request(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
}

function listAnalyses(genome) {
  const { fileId, analysis={} } = genome;
  const genomeId = genome._id.toString();
  const output = {};
  const { organismId } = analysis.speciator || {};
  if (organismId === undefined) return {};
  for (const task of Object.keys(analysis)) {
    const { __v: version } = analysis[task];
    const key = `${task}|${version}|${organismId}|${fileId}`;
    output[key] = output[key] || { genomeId, task, version, organismId, fileId };
  }
  return output;
}

async function sendFasta(fileId) {
  try {
    const stream = fastaStore.fetch(fileId);
    const r = await request(`fasta/${fileId}`, { method: 'POST', body: stream, headers: { 'Content-Type': 'application/octet-stream' } });
    return r.status === 200;
  } catch (err) {
    if (DEBUG) console.log(err);
    return false;
  }
}

async function sendGenome(genome) {
  try {
    const genomeId = genome._id.toString();
    genome._id = genomeId;
    const r = await postJson(`genome/${genomeId}`, genome);
    return r.status === 200;
  } catch (err) {
    if (DEBUG) console.log(err);
    return false;
  }
}

async function sendAnalysis({ task, version, fileId, organismId }) {
  try {
    const query = { task, version, fileId };
    if (task !== 'speciator') query.organismId = organismId;
    const doc = await Analysis.findOne(query).lean();
    if (doc === undefined || doc === null) return false;
    delete doc._id;
    const r = await postJson(`analysis/${task}/${version}/${fileId}/${organismId}`, doc);
    return r.status === 200;
  } catch (err) {
    if (DEBUG) console.log(err);
    return false;
  }
}

let genomeCount = 0;
let errorCount = 0;
async function fetchMissing({ number = 10, last }) {
  console.log({ fetchMissing: last });
  const query = {
    $or: [
      { public: true },
      { _user: ObjectId("59e4ddbf97ad4b00013f2ef0") }
    ]
  };
  if (last) query._id = { $gt: last };

  const genomes = Genome
    .find(query)
    .sort('_id')
    .limit(number)
    .lean()
    .cursor();

  let analyses = {};
  const fileIds = {};

  const offer = {};
  const needed = [];
  const errors = [];
  let lastGenomeId;
  let more = false;
  const genomesDocs = {};
  for await (const genome of genomes) {
    if (genome.fileId === undefined) continue;
    if (((genome.analysis || {}).speciator || {}).organismId === undefined) continue;
    genomeCount += 1;
    more = true;
    const genomeId = genome._id.toString();
    lastGenomeId = genomeId;
    genomesDocs[genomeId] = genome;
    offer[genomeId] = hashGenome(genome).toString('base64');
    // needed.genomes.push(genomeId);
    fileIds[genome.fileId] = fileIds[genome.fileId] || genomeId;
    analyses = { ...analyses, ...listAnalyses(genome) };
  }

  let resp = await postJson('genome/status', { genomes: offer });
  if (resp.status === 200) {
    const neededGenomeIDs = (await resp.json()).genomes;
    for (const genomeId of neededGenomeIDs) needed.push({ type: 'genome', genomeId, params: genomesDocs[genomeId] });
  }
  else errors.push('fetch genomes');

  resp = await postJson('analysis/status', { analyses: Object.values(analyses) });
  if (resp.status === 200) {
    const neededAnalyses = (await resp.json()).analyses;
    for (const { genomeId, ...params } of neededAnalyses) needed.push({ type: 'analysis', genomeId, params });
  }
  else errors.push('fetch analyses');

  resp = await postJson('fasta/status', { fileIds: Object.keys(fileIds) });
  if (resp.status === 200) {
    const neededFileIds = (await resp.json()).fileIds;
    for (const fileId of neededFileIds) needed.push({ type: 'fasta', genomeId: fileIds[fileId], params: fileId })
  }
  else errors.push('fetch fileIds');

  function preference(a, b) {
    if (a.genomeId < b.genomeId) return -1;
    else if (a.genomeId === b.genomeId && b.type === 'genome') return -1;
    else return 1;
  }

  needed.sort(preference);
  return { needed, errors, last: lastGenomeId, more };
}

function decrementHex(value) {
  if (!value) return '';
  const suffixStart = value.length > 12 ? value.length - 12 : 0;
  const prefix = value.slice(0, suffixStart)
  const suffix = value.slice(suffixStart);
  const suffixInt = parseInt(suffix, 16);
  if (suffixInt === 0) return decrementHex(prefix) + "".padStart(suffix.length, 'f');
  return prefix + (suffixInt - 1).toString(16).padStart(suffix.length, '0');
}

async function runBatch(pool, last) {
  const r = await fetchMissing({ number: 100, last });
  if (r.more && r.last) pool.enqueue(r.last).catch(() => console.log(`Error ${r.last}`));

  const { needed, errors: fetchErrors } = r;
  errorCount += fetchErrors.length;
  if (fetchErrors.length > 0) {
    console.log({ fetchErrors });
    await sleep(10 * 1000);
    pool.enqueue(last).catch(() => console.log(`Error ${last}`));
    return;
  }

  console.log(`Found ${needed.length} things to update`);
  const errors = [];
  let count = 0;
  for (const { type, genomeId, params } of needed) {
    let ok = false;
    if (type === 'genome') ok = await sendGenome(params);
    else if (type === 'fasta') ok = await sendFasta(params);
    else if (type === 'analysis') ok = await sendAnalysis(params);
    if (!ok) {
      errors.push({ genomeId, type });
      errorCount += 1;
      console.log({ error: { genomeId, type } });
      if (errors.length > 100) {
        const nextId = decrementHex(genomeId);
        pool.enqueue(nextId).catch(() => console.log(`Error ${nextId}`));
        console.log(`Starting again from ${nextId} after ${errors.length} errors`);
        await sleep(10 * 1000);
        return;
      }
    }
    count += 1;
    if (count % 100 === 0) console.log({ genomeCount, count, ok: { genomeId, type }});
  }

  const allErrors = [ ...errors, ...fetchErrors ];
  allErrors.forEach((error, errorNum) => console.log({ errorNum, of: allErrors.length, error }));

  console.log({ genomeCount, more: r.more, last: r.last, newErrors: errors.length, errors: errorCount });
}

async function main() {
  const pool = new Pool(() => {}, 10);
  pool.fn = (g) => runBatch(pool, g).catch((error) => console.log({ error, pool }));

  let last;
  if (/^[a-z0-9]{24}$/.test(process.argv[2])) {
    last = process.argv[2];
    console.log(`Starting from ${last}`);
    pool.enqueue(last).catch(() => console.log(`Error ${last}`));
  } else {
    pool.enqueue(undefined).catch(() => console.log(`Error ${undefined}`));
  }

  await pool.wait();
}

if (require.main === module) {
  mongoConnection.connect()
    .then(() => main())
    .catch((err) => { console.log(err); process.exit(1); })
    .then(() => mongoConnection.close());
}
