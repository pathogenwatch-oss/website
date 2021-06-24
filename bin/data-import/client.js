// You run this like this:
// NODE_PATH=/pathogenwatch/node_modules:/pathogenwatch/src time node bin/data-import/client.js 58ac0e13c492e60001aa083f

const { URL } = require('url');
const https = require('https');
const fetch = require('node-fetch');
const mongoose = require('mongoose');

const mongoConnection = require('utils/mongoConnection');
const Genome = require('models/genome');
const Collection = require('models/collection');
const Organism = require('models/organism');
const User = require('models/user');
const ScoreCache = require('models/scoreCache');
const Analysis = require('models/analysis');
const fastaStore = require('utils/fasta-store');

const Pool = require('./concurrentWorkers');
const { b64encode, hashGenome, hashDocument, serializeBSON } = require('./common');
const { name, pass, baseUrl: _url } = require('./env.json');

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
      if ('timeout' in error) updatedArgs.timeout *= 1.5;
    }
    await sleep(2000);
  }
  if (DEBUG) console.log({ path, error: (error || {}).message, status: (r || {}).status });
  if (error !== undefined) return { status: 500, error };
  return r;
}

function postJson(path, data) {
  return request(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
}

function listAnalyses(genome) {
  const { fileId, analysis = {} } = genome;
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

const stats = {
  additions: {
    fasta: 0,
    genome: 0,
    user: 0,
    collection: 0,
    organism: 0,
    score: 0,
    analysis: 0,
  },
  errors: {
    fasta: 0,
    genome: 0,
    user: 0,
    collection: 0,
    organism: 0,
    score: 0,
    analysis: 0,
    status: 0,
  },
};

async function sendFasta(fileId) {
  try {
    const stream = fastaStore.fetch(fileId);
    const r = await request(`fasta/${fileId}`, { method: 'POST', body: stream, headers: { 'Content-Type': 'application/octet-stream' } });
    if (r.status === 200) stats.additions.fasta += 1;
    else stats.errors.fasta += 1;
    return r.status === 200;
  } catch (err) {
    stats.errors.fasta += 1;
    return false;
  }
}

async function sendGenome(genome) {
  try {
    const genomeId = genome._id.toString();
    const r = await postJson(`genome/${genomeId}`, { genome: serializeBSON(genome) });
    if (r.status === 200) stats.additions.genome += 1;
    else stats.errors.genome += 1;
    return r.status === 200;
  } catch (err) {
    stats.errors.genome += 1;
    return false;
  }
}

async function sendUser(user) {
  try {
    const userId = user._id.toString();
    const r = await postJson(`user/${userId}`, { user: serializeBSON(user) });
    if (r.status === 200) stats.additions.user += 1;
    else stats.errors.user += 1;
    return r.status === 200;
  } catch (err) {
    stats.errors.user += 1;
    return false;
  }
}

async function sendCollection(collection) {
  try {
    const collectionId = collection._id.toString();
    const r = await postJson(`collection/${collectionId}`, { collection: serializeBSON(collection) });
    if (r.status === 200) stats.additions.collection += 1;
    else stats.errors.collection += 1;
    return r.status === 200;
  } catch (err) {
    stats.errors.collection += 1;
    return false;
  }
}

async function sendOrganism(organism) {
  try {
    const organismId = organism._id.toString();
    const r = await postJson(`organism/${organismId}`, { organism: serializeBSON(organism) });
    if (r.status === 200) stats.additions.organism += 1;
    else stats.errors.organism += 1;
    return r.status === 200;
  } catch (err) {
    stats.errors.organism += 1;
    return false;
  }
}

async function sendScoreCache(score) {
  const { versions, fileId } = score;
  const task = 'core-tree-score';
  const version = `${versions.core}_${versions.tree}`;
  try {
    const r = await postJson(`analysis/${task}/${version}/${fileId}/`, score);
    if (r.status === 200) stats.additions.score += 1;
    else stats.errors.score += 1;
    return r.status === 200;
  } catch (err) {
    stats.errors.score += 1;
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
    if (r.status === 200) stats.additions.analysis += 1;
    else stats.errors.analysis += 1;
    return r.status === 200;
  } catch (err) {
    stats.errors.analysis += 1;
    return false;
  }
}

let genomeCount = 0;
async function fetchMissingAnalysis({ number = 10, last }) {
  console.log({ fetchMissingAnalysis: last });
  const query = {
    // $or: [
    //   { public: true },
    //   { _user: ObjectId("59e4ddbf97ad4b00013f2ef0") }
    // ]
  };
  if (last) query._id = { $gt: last };

  const cursor = Genome
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
  for (let genome = await cursor.next(); genome !== null; genome = await cursor.next()) {
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
    stats.additions.genome += (Object.keys(offer).length - neededGenomeIDs.length);
    for (const genomeId of neededGenomeIDs) needed.push({ type: 'genome', genomeId, params: genomesDocs[genomeId] });
  }
  else errors.push('fetch genomes');

  resp = await postJson('analysis/status', { analyses: Object.values(analyses) });
  if (resp.status === 200) {
    const neededAnalyses = (await resp.json()).analyses;
    stats.additions.analysis += (Object.keys(analyses).length - neededAnalyses.length);
    for (const { genomeId, ...params } of neededAnalyses) needed.push({ type: 'analysis', genomeId, params });
  }
  else errors.push('fetch analyses');

  resp = await postJson('fasta/status', { fileIds: Object.keys(fileIds) });
  if (resp.status === 200) {
    const neededFileIds = (await resp.json()).fileIds;
    stats.additions.fasta += (Object.keys(fileIds).length - neededFileIds.length);
    for (const fileId of neededFileIds) needed.push({ type: 'fasta', genomeId: fileIds[fileId], params: fileId });
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
  stats.errors.status += fetchErrors.length;
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
      console.log({ error: { genomeId, type } });
      if (errors.length > 20) {
        console.log(`Received ${errors.length} errors starting at ${last}; continuing`);
        break;
        // console.log(`Starting again from ${last} after ${errors.length} errors`);
        // await sleep(10 * 1000);
        // pool.enqueue(last).catch(() => console.log(`Error ${last}`));
        // return;
      }
    }
    count += 1;
    if (count % 100 === 0) console.log({ genomeCount, count, ok: { genomeId, type }, stats, queue: pool.size });
  }

  console.log({ genomeCount, more: r.more, last: r.last, newErrors: errors.length, stats, queue: pool.size });
}

async function sendUsers() {
  const usersExpected = await User.count({});
  const cursor = User
    .find({})
    .lean()
    .cursor();

  let i = 0;
  let usersDocs = {};
  let offer = {};
  let offerSize = 0;
  for (let user = await cursor.next(); user !== null; user = await cursor.next()) {
    const userId = user._id.toString();
    usersDocs[userId] = user;
    offer[userId] = hashDocument(user).toString('base64');
    offerSize += 1;

    if (offerSize >= 100) {
      const resp = await postJson('user/status', { users: offer });
      if (resp.status === 200) {
        const neededUserIDs = (await resp.json()).users;
        stats.additions.user += (Object.keys(offer).length - neededUserIDs.length);
        for (const needed of neededUserIDs) {
          await sendUser(usersDocs[needed]);
          i += 1;
        }
      }
      else stats.errors.status += offerSize;
      console.log({ userCount: i, usersExpected, stats });
      usersDocs = {};
      offer = {};
      offerSize = 0;
    }
  }
  console.log({ userCount: i, usersExpected, stats });
}

async function sendCollections() {
  const collectionExpected = await Collection.count({});
  const cursor = Collection
    .find({})
    .lean()
    .cursor();

  let i = 0;
  let collectionsDocs = {};
  let offer = {};
  let offerSize = 0;
  for (let collection = await cursor.next(); collection !== null; collection = await cursor.next()) {
    const collectionId = collection._id.toString();
    collectionsDocs[collectionId] = collection;
    offer[collectionId] = hashDocument(collection).toString('base64');
    offerSize += 1;

    if (offerSize >= 100) {
      const resp = await postJson('collection/status', { collections: offer });
      if (resp.status === 200) {
        const neededCollectionIDs = (await resp.json()).collections;
        stats.additions.collection += (Object.keys(offer).length - neededCollectionIDs.length);
        for (const needed of neededCollectionIDs) {
          await sendCollection(collectionsDocs[needed]);
          i += 1;
        }
      }
      else stats.errors.collection += offerSize;
      console.log({ collectionCount: i, collectionExpected, stats });
      collectionsDocs = {};
      offer = {};
      offerSize = 0;
    }
  }
  console.log({ collectionCount: i, collectionExpected, stats });
}

async function sendScoreCaches() {
  const scoreExpected = await ScoreCache.count({});
  const cursor = ScoreCache
    .find({})
    .lean()
    .cursor();

  async function* gen() {
    for (let score = await cursor.next(); score !== null; score = await cursor.next()) {
      yield score;
    }
  }

  const scores = gen();

  let i = 0;
  async function worker() {
    for await (const score of scores) {
      await sendScoreCache(score);
      i += 1;
      if (i % 100 === 0) console.log({ scoreCount: i, scoreExpected, stats });
    }
  }

  const workers = [];
  for (let w = 0; w < 10; w++) workers.push(worker());
  await Promise.all(workers);

  console.log({ scoreCount: i, scoreExpected, stats });
}

async function sendOrganisms() {
  const organismExpected = await Organism.count({});
  const cursor = Organism.find({}).lean().cursor();
  let i = 0;

  for (let organism = await cursor.next(); organism !== null; organism = await cursor.next()) {
    await sendOrganism(organism);
    i += 1;
    if (i % 100 === 0) console.log({ organismCount: i, stats });
  }

  console.log({ organismCount: i, organismExpected, stats });
}

async function main() {
  // const tasks = [
  //   sendOrganisms(),
  //   sendUsers(),
  //   sendCollections(),
  // ];
  // await Promise.all(tasks);
  // await sendScoreCaches()

  const pool = new Pool(() => {}, 10);
  pool.fn = (g) => sendAnalysisBatch(pool, g).catch(() => console.log("Error in batch"));

  let last;
  if (/^[a-z0-9]{24}$/.test(process.argv[2])) {
    last = process.argv[2];
    console.log(`Starting from ${last}`);
    pool.enqueue(last).catch(() => console.log(`Error ${last}`));
  } else {
    pool.enqueue(undefined).catch(() => console.log(`Error ${undefined}`));
  }

  await pool.wait();
  console.log("End", { genomeCount, stats, queue: pool.size });
}

if (require.main === module) {
  mongoConnection.connect()
    .then(() => main())
    .catch((err) => { console.log(err); process.exit(1); })
    .then(() => mongoConnection.close());
}
