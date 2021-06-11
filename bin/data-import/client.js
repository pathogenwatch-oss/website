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
const { b64encode, hashGenome, serializeBSON } = require('./common');
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
  if (DEBUG) console.log({ path, error: (error || {}).message, status: (r || {}).status });
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
  if (organismId === undefined || fileId === undefined) return {};
  for (const task of Object.keys(analysis)) {
    const { __v: version } = analysis[task];
    const key = `${task}|${version}|${organismId}|${fileId}`;
    output[key] = output[key] || { genomeId, task, version, organismId, fileId };
  }
  return output;
}

const additions = {
  fasta: 0,
  genome: 0,
  analysis: 0,
  user: 0,
  collection: 0,
  score: 0,
}

async function sendFasta(fileId) {
  try {
    const stream = fastaStore.fetch(fileId);
    const r = await request(`fasta/${fileId}`, { method: 'POST', body: stream, headers: { 'Content-Type': 'application/octet-stream' } });
    additions.fasta += 1;
    return r.status === 200;
  } catch (err) {
    return false;
  }
}

async function sendGenome(genome) {
  try {
    const genomeId = genome._id.toString();
    const r = await postJson(`genome/${genomeId}`, { genome: serializeBSON(genome) });
    additions.genome += 1;
    return r.status === 200;
  } catch (err) {
    return false;
  }
}

async function sendUser(user) {
  try {
    const userId = user._id.toString();
    const r = await postJson(`user/${userId}`, { user: serializeBSON(user) });
    additions.user += 1;
    return r.status === 200;
  } catch (err) {
    return false;
  }
}

async function sendCollection(collection) {
  try {
    const collectionId = collection._id.toString();
    const r = await postJson(`collection/${collectionId}`, { collection: serializeBSON(collection) });
    additions.collection += 1;
    return r.status === 200;
  } catch (err) {
    return false;
  }
}

async function sendScoreCache(score) {
  const { versions, fileId } = score;
  const task = 'core-tree-score';
  const version = `${versions.core}_${versions.tree}`;
  try {
    const r = await postJson(`analysis/${task}/${version}/${fileId}/`, doc);
    additions.analyscoresis += 1;
    return r.status === 200;
  } catch (err) {
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
    additions.analysis += 1;
    return r.status === 200;
  } catch (err) {
    return false;
  }
}

let genomeCount = 0;
let errorCount = 0;
async function fetchMissingAnalysis({ number = 10, last }) {
  console.log({ fetchMissingAnalysis: last });
  const query = {
    // $or: [
    //   { public: true },
    //   { _user: ObjectId("59e4ddbf97ad4b00013f2ef0") }
    // ]
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
    genomeCount += 1;
    more = true;
    const genomeId = genome._id.toString();
    lastGenomeId = genomeId;
    genomesDocs[genomeId] = genome;
    offer[genomeId] = hashGenome(genome).toString('base64');
    // needed.genomes.push(genomeId);
    if (genome.fileId) fileIds[genome.fileId] = fileIds[genome.fileId] || genomeId;
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

async function sendAnalysisBatch(pool, last) {
  const r = await fetchMissingAnalysis({ number: 100, last });

  const { needed, errors: fetchErrors } = r;
  errorCount += fetchErrors.length;
  if (fetchErrors.length > 0) {
    console.log({ fetchErrors });
    await sleep(10 * 1000);
    pool.enqueue(last).catch(() => console.log(`Error ${last}`));
    return;
  }

  if (r.more && r.last) pool.enqueue(r.last).catch(() => console.log(`Error ${r.last}`));

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
      if (errors.length > 20) {
        console.log(`Starting again from ${last} after ${errors.length} errors`);
        await sleep(10 * 1000);
        pool.enqueue(last).catch(() => console.log(`Error ${nextId}`));
        return;
      }
    }
    count += 1;
    if (count % 100 === 0) console.log({ genomeCount, count, ok: { genomeId, type }, additions, queue: pool.size });
  }

  console.log({ genomeCount, more: r.more, last: r.last, newErrors: errors.length, errors: errorCount, additions, queue: pool.size  });
}

async function sendUsers() {
  const users = await User
    .find({})
    .lean()
    .cursor();

  let i = 0;
  let errors = 0;
  let usersDocs = {};
  let offer = {};
  let offerSize = 0;
  for await (user of users) {
    const userId = user._id.toString();
    usersDocs[userId] = user;
    offer[userId] = hashDocument(user).toString('base64');
    offerSize += 1;

    if (offerSize >= 100) {
      let resp = await postJson('user/status', { users: offer });
      if (resp.status === 200) {
        const neededUserIDs = (await resp.json()).users;
        for (const userId of neededUserIDs) {
          const ok = await sendUser(usersDocs[userId]);
          if (!ok) errors += 1;
        };
      }
      else errors += offerSize;
      console.log({ userCount: i, userErrors: errors, additions })
      usersDocs = {};
      offer = {};
      offerSize = 0;
    }
  }
  console.log({ userCount: i, userErrors: errors, additions })
}

async function sendCollections() {
  const collections = await Collection
    .find({})
    .lean()
    .cursor();

  let i = 0;
  let errors = 0;
  let collectionsDocs = {};
  let offer = {};
  let offerSize = 0;
  for await (collection of collections) {
    const collectionId = collection._id.toString();
    collectionsDocs[collectionId] = collection;
    offer[collectionId] = hashDocument(collection).toString('base64');
    offerSize += 1;

    if (offerSize >= 100) {
      let resp = await postJson('collection/status', { collections: offer });
      if (resp.status === 200) {
        const neededCollectionIDs = (await resp.json()).collections;
        for (const collectionId of neededCollectionIDs) {
          const ok = await sendCollection(collectionsDocs[collectionId]);
          if (!ok) errors += 1;
        };
      }
      else errors += offerSize;
      console.log({ collectionCount: i, collectionErrors: errors, additions })
      collectionsDocs = {};
      offer = {};
      offerSize = 0;
    }
  }
  console.log({ collectionCount: i, collectionErrors: errors, additions })
}

async function sendScoreCaches() {
  const scores = await ScoreCache
    .find({})
    .lean()
    .cursor();

  let i = 0;
  let errors = 0;
  for await (score of scores) {
    const ok = await sendScoreCache(score);
    if (!ok) errors += 1;
    if (i % 100 == 0) console.log({ scoreCount: i, scoreErrors: errors, additions })
  }
}

async function main() {
  tasks = [sendUsers(), sendCollections(), sendScoreCaches()]
  await Promise.all(tasks);

  const pool = new Pool(() => {}, 10);
  pool.fn = (g) => sendAnalysisBatch(pool, g).catch((error) => console.log({ error, pool }));

  let last;
  if (/^[a-z0-9]{24}$/.test(process.argv[2])) {
    last = process.argv[2];
    console.log(`Starting from ${last}`);
    pool.enqueue(last).catch(() => console.log(`Error ${last}`));
  } else {
    pool.enqueue(undefined).catch(() => console.log(`Error ${undefined}`));
  }

  await pool.wait();
  console.log("End", { genomeCount, errors: errorCount, additions, queue: pool.size  });
}

if (require.main === module) {
  mongoConnection.connect()
    .then(() => main())
    .catch((err) => { console.log(err); process.exit(1); })
    .then(() => mongoConnection.close());
}
