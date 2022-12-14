// You run this like this:
// NODE_PATH=/pathogenwatch/node_modules:/pathogenwatch/src time node bin/data-import/client.js 58ac0e13c492e60001aa083f

const { URL } = require('url');
const https = require('https');
const fetch = require('node-fetch');
const fs = require('fs');
const pLimit = require('p-limit');
const zlib = require('zlib');

const mongoConnection = require('utils/mongoConnection');
const Genome = require('models/genome');
const Collection = require('models/collection');
const Organism = require('models/organism');
const User = require('models/user');
const ScoreCache = require('models/scoreCache');
const Analysis = require('models/analysis');
const fastaStore = require('./localFasta');

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

const statusLimit = pLimit(15);
const uploadLimit = pLimit(15);

const DEBUG = process.env.DEBUG === 'true';
const MAX_RETRIES = 3;
if (DEBUG) console.log({ DEBUG });

const stats = {
  stats: {},
  inc(key, value = 1) {
    if (value === 0) return;
    this.stats[key] = this.stats[key] || 0;
    this.stats[key] += value;
    if (this.stats[key] % 100 === 0) console.log({ stats: this.format() });
  },
  format() {
    const keys = Object.keys(this.stats);
    keys.sort();
    return keys.map((key) => `${key} => ${this.stats[key]}`);
  },
};

async function request(path, args = {}) {
  const url = `${baseUrl.origin}${baseUrl.pathname.replace(/\/+/g, '/')}${path}${baseUrl.search}`;
  const { headers: originalHeaders = {} } = args;

  const updatedArgs = {
    timeout: path.includes('/status') ? 90000 : 10000,
    ...args,
    headers: { ...originalHeaders, ...authHeaders },
    agent: httpsAgent,
  };

  let r;
  let error;
  for (let retry = 0; retry < MAX_RETRIES; retry++) {

    let reqType = 'unknown-type';
    if (path.includes('fasta')) reqType = 'fasta';
    else if (path.includes('genome')) reqType = 'genome';
    else if (path.includes('collection')) reqType = 'collection';
    else if (path.includes('user')) reqType = 'user';
    else if (path.includes('organism')) reqType = 'organism';

    if (retry > 0) stats.inc(`retry.${reqType}`);

    try {
      if (typeof args.body === 'function') updatedArgs.body = args.body();
      r = await fetch(url, updatedArgs);
      if (r.status === 503) throw new Error('Back off');
      if (r.status >= 200 && r.status < 500) {
        return r;
      }
    } catch (e) {
      error = e;
      if (error.message && (error.message.includes('timeout') || error.message.includes('Back off'))) {
        stats.inc(`timeout.${reqType}`);
        updatedArgs.timeout *= 1.5;
      }
    }
    if (retry < MAX_RETRIES) await sleep(100);
  }
  if (DEBUG) console.log({ path, error: (error || {}).message, status: (r || {}).status, timeout: updatedArgs.timeout });
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

async function sendFasta(fileId) {
  try {
    const body = () => fastaStore.fetch(fileId);
    const r = await uploadLimit(() => request(`fasta/${fileId}`, { timeout: 20000, method: 'POST', body, headers: { 'Content-Type': 'application/octet-stream' } }));
    if (r.status === 200) stats.inc('additions.fasta');
    else stats.inc('errors.fasta');
    return r.status === 200;
  } catch (err) {
    if (DEBUG) console.log(err);
    stats.inc('errors.fasta');
    return false;
  }
}

async function sendGenome(genome) {
  try {
    const genomeId = genome._id.toString();
    const r = await uploadLimit(() => postJson(`genome/${genomeId}`, { genome: serializeBSON(genome) }));
    if (r.status === 200) stats.inc('additions.genome');
    else stats.inc('errors.genome');
    return r.status === 200;
  } catch (err) {
    if (DEBUG) console.log(err);
    stats.inc('errors.genome');
    return false;
  }
}

async function sendUser(user) {
  try {
    const userId = user._id.toString();
    const r = await uploadLimit(() => postJson(`user/${userId}`, { user: serializeBSON(user) }));
    if (r.status === 200) stats.inc('additions.user');
    else stats.inc('errors.user');
    return r.status === 200;
  } catch (err) {
    if (DEBUG) console.log(err);
    stats.inc('errors.user');
    return false;
  }
}

async function sendCollection(collection) {
  try {
    const collectionId = collection._id.toString();
    const r = await uploadLimit(() => postJson(`collection/${collectionId}`, { collection: serializeBSON(collection) }));
    if (r.status === 200) stats.inc('additions.collection');
    else stats.inc('errors.collection');
    return r.status === 200;
  } catch (err) {
    if (DEBUG) console.log(err);
    stats.inc('errors.collection');
    return false;
  }
}

async function sendOrganism(organism) {
  try {
    const organismId = organism._id.toString();
    const r = await uploadLimit(() => postJson(`organism/${organismId}`, { organism: serializeBSON(organism) }));
    if (r.status === 200) stats.inc('additions.organism');
    else stats.inc('errors.organism');
    return r.status === 200;
  } catch (err) {
    if (DEBUG) console.log(err);
    stats.inc('errors.organism');
    return false;
  }
}

async function sendTreeScore(treeScore) {
  try {
    const treeScoreId = treeScore._id.toString();
    const r = await uploadLimit(() => postJson(`treeScore/${treeScoreId}`, { treeScore: serializeBSON(treeScore) }));
    if (r.status === 200) stats.inc('additions.treeScore');
    else stats.inc('errors.treeScore');
    return r.status === 200;
  } catch (err) {
    if (DEBUG) console.log(err);
    stats.inc('errors.treeScore');
    return false;
  }
}

async function sendAnalysis({ task, version, fileId, organismId }) {
  try {
    const query = { task, version, fileId };
    if (task !== 'speciator') query.organismId = organismId;
    const doc = await Analysis.findOne(query).lean();
    if (doc === undefined || doc === null) {
      if (DEBUG) console.log(`Missing analysis ${task}:${version} for ${fileId}`);
      stats.inc('missing.analysis');
      return true; // Its an error but not one we can return;
    }
    delete doc._id;
    const r = await uploadLimit(() => postJson(`analysis/${task}/${version}/${fileId}/${organismId}`, doc));
    if (r.status === 200) stats.inc('additions.analysis');
    else stats.inc('errors.analysis');
    return r.status === 200;
  } catch (err) {
    if (DEBUG) console.log(err);
    stats.inc('errors.analysis');
    return false;
  }
}

const BATCH_SIZE = 100;
async function* batchOffsets(from, query = {}) {
  if (from) query._id = { $gte: from };
  let doc = await Genome.findOne(query, { _id: 1 }).sort('_id').lean();
  while (doc) {
    yield doc._id;
    const docs = await Genome.find({ _id: { $gte: doc._id } }, { _id: 1 })
      .sort('_id')
      .skip(BATCH_SIZE)
      .limit(1)
      .lean();
    doc = docs[0];
  }
}

let genomeCount = 0;
async function fetchMissingAnalysis({ offset, query = {} }) {
  console.log({ fetchMissingAnalysis: offset });
  if (offset) query._id = { $gt: offset };

  const cursor = Genome
    .find(query)
    .sort('_id')
    .limit(BATCH_SIZE)
    .lean()
    .cursor();

  let analyses = {};
  const fileIds = {};

  const offer = {};
  const needed = [];
  const errors = [];
  const genomesDocs = {};
  for (let genome = await cursor.next(); genome !== null; genome = await cursor.next()) {
    genomeCount += 1;
    const genomeId = genome._id.toString();
    genomesDocs[genomeId] = genome;
    offer[genomeId] = hashGenome(genome).toString('base64');
    // needed.genomes.push(genomeId);
    if (genome.fileId) fileIds[genome.fileId] = fileIds[genome.fileId] || genomeId;
    analyses = { ...analyses, ...listAnalyses(genome) };
  }

  let resp = await statusLimit(() => postJson('genome/status', { genomes: offer }));
  if (resp.status === 200) {
    const neededGenomeIDs = (await resp.json()).genomes;
    stats.inc('cache.genome', (Object.keys(offer).length - neededGenomeIDs.length));
    for (const genomeId of neededGenomeIDs) needed.push({ type: 'genome', genomeId, params: genomesDocs[genomeId] });
  }
  else errors.push('fetch genomes');

  resp = await statusLimit(() => postJson('analysis/status', { analyses: Object.values(analyses) }));
  if (resp.status === 200) {
    const neededAnalyses = (await resp.json()).analyses;
    stats.inc('cache.analysis', (Object.keys(analyses).length - neededAnalyses.length));
    for (const { genomeId, ...params } of neededAnalyses) needed.push({ type: 'analysis', genomeId, params });
  }
  else errors.push('fetch analyses');

  resp = await statusLimit(() => postJson('fasta/status', { fileIds: Object.keys(fileIds) }));
  if (resp.status === 200) {
    const neededFileIds = (await resp.json()).fileIds;
    stats.inc('cache.fasta', (Object.keys(fileIds).length - neededFileIds.length));
    for (const fileId of neededFileIds) needed.push({ type: 'fasta', genomeId: fileIds[fileId], params: fileId });
  }
  else errors.push('fetch fileIds');

  function preference(a, b) {
    if (a.genomeId < b.genomeId) return -1;
    else if (a.genomeId === b.genomeId && b.type === 'genome') return -1;
    else return 1;
  }

  needed.sort(preference);
  if (DEBUG && errors.length > 0) console.log(errors);
  return { needed, errors };
}

const errorBatches = [];
async function sendAnalysisBatch(offset, query = {}) {
  let errors = 0;
  const r = await fetchMissingAnalysis({ number: 100, offset, query });

  const { needed, errors: fetchErrors } = r;
  stats.inc('errors.status', fetchErrors.length);
  if (fetchErrors.length > 0) {
    console.log({ fetchErrors });
    await sleep(10 * 1000);
    errors += fetchErrors.length;
  }

  console.log(`Found ${needed.length} things to update`);
  let count = 0;
  for (const { type, params } of needed) {
    let ok = false;
    if (type === 'genome') ok = await sendGenome(params);
    else if (type === 'fasta') ok = await sendFasta(params);
    else if (type === 'analysis') ok = await sendAnalysis(params);
    if (!ok) errors += 1;
    count += 1;
    if (errors > 0 && errors % 20 === 0) console.log(`Received ${errors} errors starting at ${offset}`);
    if (count % 100 === 0) console.log({ stats: stats.format() });
  }
  if (errors) {
    await sleep(1000);
    errorBatches.append(offset);
  }
  console.log({ genomeCount, errors, errorBatches: errorBatches.length, stats: stats.format() });
}

async function sendAnalysisBatches(from, query = {}) {
  const batches = batchOffsets(from, query);
  async function worker(w) {
    await sleep(w * 2 * 1000);
    for await (const genomeId of batches) {
      try {
        await sendAnalysisBatch(genomeId, query);
      } catch (err) {
        console.log(`Error processing batch ${genomeId}`);
      }
      try {
        await fs.promises.writeFile(`./latestGenomeId.${w}.txt`, genomeId.toString());
        await fs.promises.rename(`./latestGenomeId.${w}.txt`, `./latestGenomeId.txt`);
      } catch (err) {
        console.log(`Error saving progress (batch ${genomeId})`);
      }
    }
  }

  const workers = [];
  for (let w = 0; w < 10; w++) {
    workers.push(worker(w));
  }

  await Promise.all(workers);
  await fs.promises.writeFile(`./latestGenomeId.complete.txt`, 'complete');
  await fs.promises.rename(`./latestGenomeId.complete.txt`, `./latestGenomeId.txt`);
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
      const resp = await statusLimit(() => postJson('user/status', { users: offer }));
      if (resp.status === 200) {
        const neededUserIDs = (await resp.json()).users;
        stats.inc('cache.user', (Object.keys(offer).length - neededUserIDs.length));
        for (const needed of neededUserIDs) {
          await sendUser(usersDocs[needed]);
          i += 1;
        }
      }
      else stats.inc('errors.status', offerSize);
      console.log({ userCount: i, usersExpected, stats: stats.format() });
      usersDocs = {};
      offer = {};
      offerSize = 0;
    }
  }
  console.log({ userCount: i, usersExpected, stats: stats.format() });
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
      const resp = await statusLimit(() => postJson('collection/status', { collections: offer }));
      if (resp.status === 200) {
        const neededCollectionIDs = (await resp.json()).collections;
        stats.inc('cache.collection', (Object.keys(offer).length - neededCollectionIDs.length));
        for (const needed of neededCollectionIDs) {
          await sendCollection(collectionsDocs[needed]);
          i += 1;
        }
      }
      else stats.inc('errors.collection', offerSize);
      console.log({ collectionCount: i, collectionExpected, stats: stats.format() });
      collectionsDocs = {};
      offer = {};
      offerSize = 0;
    }
  }
  console.log({ collectionCount: i, collectionExpected, stats: stats.format() });
}

async function sendTreeScores() {
  const treeScoreExpected = await ScoreCache.count({});
  let i = 0;

  async function* generateTasks() {
    const cursor = ScoreCache
      .find({})
      .lean()
      .cursor();

    let treeScoresDocs = {};
    let offer = {};
    let offerSize = 0;

    for (let treeScore = await cursor.next(); treeScore !== null; treeScore = await cursor.next()) {
      const treeScoreId = treeScore._id.toString();
      treeScoresDocs[treeScoreId] = treeScore;
      offer[treeScoreId] = hashDocument(treeScore).toString('base64');
      offerSize += 1;

      if (offerSize >= 100) {
        yield { i, treeScoresDocs, offer };
        treeScoresDocs = {};
        offer = {};
        offerSize = 0;
      }
    }
  }

  const tasks = generateTasks();
  async function worker(workerId) {
    await sleep(workerId * 500);
    for await (const { offer, treeScoresDocs } of tasks) {
      const resp = await statusLimit(() => postJson('treeScore/status', { treeScores: offer }));
      if (resp.status === 200) {
        const neededTreeScoreIDs = (await resp.json()).treeScores;
        stats.inc('cache.treeScore', (Object.keys(offer).length - neededTreeScoreIDs.length));
        for (const needed of neededTreeScoreIDs) {
          await sendTreeScore(treeScoresDocs[needed]);
          i += 1;
        }
      }
      else stats.inc('errors.treeScore', Object.keys(offer).length);
      console.log({ workerId, treeScoreCount: i, treeScoreExpected, stats: stats.format() });
    }
  }

  const workers = [];
  for (let w = 0; w < 5; w++) {
    workers.push(worker(w));
  }
  await Promise.all(workers);

  console.log({ treeScoreCount: i, treeScoreExpected, stats: stats.format() });
}

async function sendOrganisms() {
  const organismExpected = await Organism.count({});
  const cursor = Organism.find({}).lean().cursor();
  let i = 0;

  for (let organism = await cursor.next(); organism !== null; organism = await cursor.next()) {
    await sendOrganism(organism);
    i += 1;
    if (i % 100 === 0) console.log({ organismCount: i, stats: stats.format() });
  }

  console.log({ organismCount: i, organismExpected, stats: stats.format() });
}

async function main() {
  let last;
  try {
    last = (await fs.promises.readFile(`./latestGenomeId.txt`)).toString('utf8');
  } catch (err) {
    console.log(`Error loading progress file: ${err}`);
  } finally {
    console.log(`Starting from ${last || 'beginning'}`);
  }

  if (last === 'complete') {
    console.log("Already finished");
    return;
  }

  if (last === undefined) {
    const tasks = [
      sendOrganisms(),
      sendUsers(),
      sendCollections(),
      sendTreeScores(),
    ];
    await Promise.all(tasks);
  }

  // await sendAnalysisBatches(last, { public: true });
  await sendAnalysisBatches(last);

  console.log("End", { genomeCount, stats: stats.format() });
}

if (require.main === module) {
  mongoConnection.connect()
    .then(() => main())
    .catch((err) => { console.log(err); process.exit(1); })
    .then(() => mongoConnection.close());
}

function fizz() {
  const fs = require('fs');
  async function foo() {
    const cacheFile = './cache.json';
    const contents = await fs.promises.readFile(cacheFile);
    const { cache: keys = [] } = JSON.parse(contents);
    const storeCache = new Set(keys);
    console.time('has');
    for (const key of keys.slice(0, 1000)) storeCache.has(key);
    console.timeEnd('has');
  }
}
