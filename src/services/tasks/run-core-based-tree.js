/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-params: 0 */
/* eslint max-params: 0 */

const BSON = require('bson');

const bson = new BSON();
const { Readable } = require('stream');
const readline = require('readline');

const Collection = require('models/collection');
const Genome = require('models/genome');
const TaskLog = require('models/taskLog');
const docker = require('services/docker');
const store = require('utils/object-store');

const { getImageName } = require('manifest.js');
const { request } = require("services");

const LOGGER = require('utils/logging').createLogger('runner');

async function getGenomes(task, metadata) {
  const { collectionId, name: refName, organismId } = metadata;
  const { genomes } = await Collection.findOne(
    { _id: collectionId },
    { genomes: 1 },
  )
    .lean();

  let query = { _id: { $in: genomes } };
  if (task === 'subtree') {
    query = {
      'analysis.speciator.organismId': organismId,
      'analysis.core.fp.reference': refName,
      $or: [ { _id: { $in: genomes } }, { population: true } ],
    };
  }

  const docs = await Genome
    .find(query, { fileId: 1, name: 1 }, { sort: { fileId: 1 } })
    .lean();

  const ids = new Set(genomes.map((_) => _.toString()));

  return docs.map(({ _id, fileId, name }) => ({
    _id,
    fileId,
    name,
    population: !ids.has(_id.toString()),
  }));
}

async function* createGenomesStream(genomes, uncachedFileIds, versions, organismId) {
  const genomeLookup = {};
  for (const genome of genomes) {
    const { fileId } = genome;
    if (!uncachedFileIds.has(fileId)) continue;
    genomeLookup[fileId] = genomeLookup[fileId] || [];
    genomeLookup[fileId].push(genome);
  }

  const fileIds = Array.from(uncachedFileIds);
  fileIds.sort();

  const analysisKeys = fileIds.map((fileId) => store.analysisKey('core', versions.core, fileId, organismId));
  for await (const value of store.iterGet(analysisKeys)) {
    if (value === undefined) continue;
    const { fileId, results } = JSON.parse(value);
    genomeLookup[fileId] = genomeLookup[fileId] || [];
    for (const genomeDetails of genomeLookup[fileId]) {
      const genome = {
        ...genomeDetails,
        analysis: {
          core: {
            profile: results.profile,
          },
        },
      };
      yield genome;
    }
    genomeLookup[fileId] = [];
  }
}

const EMPTY_SCORE = 4294967295;
const EMPTY_LOCATION = 65535;

async function readScoreCache(versions, organismId, fileIds) {
  console.time('Read Cache');
  const sortedFileIds = [ ...fileIds ];
  sortedFileIds.sort();

  const analysisKeys = sortedFileIds.map((fileId) => store.analysisKey('core-tree-score', `${versions.core}_${versions.tree}`, fileId, organismId));

  const fileIdLookup = {};
  sortedFileIds.forEach((fileId, i) => { fileIdLookup[fileId] = i; });

  const nScores = (sortedFileIds.length * (sortedFileIds.length - 1)) / 2;
  const cache = {
    scores: new Uint32Array(nScores),
    differences: new Uint32Array(nScores),
    locations: new Uint16Array(nScores),
    fileIds: sortedFileIds,
    counts: new Uint16Array(sortedFileIds.length), // zero the counts
    update: (doc, saveLocation = false) => {
      const aIdx = fileIdLookup[doc.fileId];
      if (aIdx === undefined) return;
      for (const fileId in doc.scores) { // eslint-disable-line guard-for-in
        const bIdx = fileIdLookup[fileId];
        if (bIdx === undefined) return;
        const idx = aIdx < bIdx ? (bIdx * (bIdx - 1) / 2) + aIdx : (aIdx * (aIdx - 1) / 2) + bIdx;
        cache.scores[idx] = doc.scores[fileId];
        cache.differences[idx] = doc.differences[fileId];
        if (saveLocation) cache.locations[idx] = aIdx;
      }
      console.dir({ doc, saveLocation, scores: cache.scores, locations: cache.locations, counts: cache.counts, fileIds: cache.fileIds })
    },
  };
  cache.scores.fill(EMPTY_SCORE);
  cache.differences.fill(EMPTY_SCORE);
  cache.locations.fill(EMPTY_LOCATION);

  let idxA = -1;
  console.dir({ init: cache });
  for await (const value of store.iterGet(analysisKeys)) {
    idxA += 1;
    if (value === undefined) continue;
    const doc = JSON.parse(value);
    cache.counts[idxA] = Object.keys(doc.scores).length;
    cache.update(doc, true);
  }

  async function* cacheDocs() {
    // eslint-disable-next-line guard-for-in
    for (const aIdx in sortedFileIds) {
      const cacheDoc = { fileId: sortedFileIds[aIdx], scores: {}, differences: {}, versions };
      for (let bIdx = 0; bIdx < aIdx; bIdx++) {
        const idx = (aIdx * (aIdx - 1) / 2) + bIdx;
        const fileId = sortedFileIds[bIdx];
        const score = cache.scores[idx];
        const difference = cache.differences[idx];
        if (score !== EMPTY_SCORE) cacheDoc.scores[fileId] = score;
        if (difference !== EMPTY_SCORE) cacheDoc.differences[fileId] = difference;
      }
      yield cacheDoc;
    }
    console.timeEnd('Read Cache');
  }

  return { cache, stream: cacheDocs() };
}

function planCacheLocations(cache) {
  cache.wasUpdated = new Uint8Array(cache.fileIds.length);
  for (let offset = 1; offset < cache.fileIds.length; offset++) {
    for (let aIdx = 0; aIdx < cache.fileIds.length; aIdx++) {
      const bIdx = (aIdx + offset) % cache.fileIds.length;
      const idx = aIdx < bIdx ? (bIdx * (bIdx - 1) / 2) + aIdx : (aIdx * (aIdx - 1) / 2) + bIdx;
      const currentLocation = cache.locations[idx];
      if (currentLocation === EMPTY_LOCATION) {
        if (cache.counts[aIdx] >= cache.counts[bIdx]) {
          // console.dir({ here: 1, cache, aIdx, bIdx, idx });
          cache.locations[idx] = bIdx;
          cache.counts[bIdx] += 1;
          cache.wasUpdated[bIdx] = true;
        } else {
          // console.dir({ here: 2, cache, aIdx, bIdx, idx });
          cache.locations[idx] = aIdx;
          cache.counts[aIdx] += 1;
          cache.wasUpdated[aIdx] = true;
        }
      } else if (currentLocation === aIdx && (cache.counts[aIdx] > (cache.counts[bIdx] + 5))) {
        // console.dir({ here: 3, cache, aIdx, bIdx, idx });
        cache.locations[idx] = bIdx;
        cache.counts[aIdx] -= 1;
        cache.counts[bIdx] += 1;
        cache.wasUpdated[aIdx] = true;
        cache.wasUpdated[bIdx] = true;
      } else if (currentLocation === bIdx && (cache.counts[bIdx] > (cache.counts[aIdx] + 5))) {
        // console.dir({ here: 4, cache, aIdx, bIdx, idx });
        cache.locations[idx] = aIdx;
        cache.counts[aIdx] += 1;
        cache.counts[bIdx] -= 1;
        cache.wasUpdated[aIdx] = true;
        cache.wasUpdated[bIdx] = true;
      }
    }
  }

  let idx = -1;
  for (let aIdx = 0; aIdx < cache.fileIds.length; aIdx++) {
    for (let bIdx = 0; bIdx < aIdx; bIdx++) {
      idx += 1;
      const currentLocation = cache.locations[idx];
      if (currentLocation === aIdx && (cache.counts[aIdx] > (cache.counts[bIdx] + 5))) {
        // console.dir({ here: 5, cache, aIdx, bIdx, idx });
        cache.locations[idx] = bIdx;
        cache.counts[aIdx] -= 1;
        cache.counts[bIdx] += 1;
        cache.wasUpdated[aIdx] = true;
        cache.wasUpdated[bIdx] = true;
      } else if (currentLocation === bIdx && (cache.counts[bIdx] > (cache.counts[aIdx] + 5))) {
        // console.dir({ here: 6, cache, aIdx, bIdx, idx });
        cache.locations[idx] = aIdx;
        cache.counts[aIdx] += 1;
        cache.counts[bIdx] -= 1;
        cache.wasUpdated[aIdx] = true;
        cache.wasUpdated[bIdx] = true;
      }
    }
  }
}

async function updateScoreCache(versions, organismId, cache) {
  planCacheLocations(cache);

  for (let aIdx = 0; aIdx < cache.fileIds.length; aIdx += 1) {
    if (!cache.wasUpdated[aIdx]) {
      console.log(`No need to redownload / update ${cache.fileIds[aIdx]}`);
      continue;
    }
    const fileId = cache.fileIds[aIdx];

    // Fetch the existing cache for this fileId
    const value = await store.getAnalysis('core-tree-score', `${versions.core}_${versions.tree}`, fileId, organismId);
    const update = value === undefined ? { fileId, versions, scores: {}, differences: {} } : JSON.parse(value);

    // Loop over the fileIds we've compared with it and descide if the cache will go into this document
    // or into the document for the other fileId.
    for (let bIdx = 0; bIdx < cache.fileIds.length; bIdx++) {
      if (aIdx === bIdx) continue;

      const fileIdB = cache.fileIds[bIdx];
      // The scores are held in a flat array to reduce memory, find the index into that array for these fileIds
      const idx = aIdx < bIdx ? (bIdx * (bIdx - 1) / 2) + aIdx : (aIdx * (aIdx - 1) / 2) + bIdx;
      const score = cache.scores[idx];
      const difference = cache.differences[idx];

      if (cache.locations[idx] === aIdx) {
        if (score !== EMPTY_SCORE && update.scores[fileIdB] !== score) {
          // console.dir({ here: 7, cache, aIdx, bIdx, idx });
          update.scores[fileIdB] = score;
          cache.wasUpdated[aIdx] = true;
        }
        if (difference !== EMPTY_SCORE && update.differences[fileIdB] !== difference) {
          // console.dir({ here: 8, cache, aIdx, bIdx, idx });
          update.differences[fileIdB] = difference;
          cache.wasUpdated[aIdx] = true;
        }
      } else {
        if (update.scores[fileIdB] !== undefined) {
          // console.dir({ here: 9, cache, aIdx, bIdx, idx });
          delete update.scores[fileIdB];
          cache.wasUpdated[aIdx] = true;
        }
        if (update.differences[fileIdB] !== undefined) {
          // console.dir({ here: 10, cache, aIdx, bIdx, idx });
          delete update.differences[fileIdB];
          cache.wasUpdated[aIdx] = true;
        }
      }
    }

    // console.dir({ updatedCacheDoc: update });
    if (cache.wasUpdated[aIdx]) await store.putAnalysis('core-tree-score', `${versions.core}_${versions.tree}`, fileId, organismId, update);
    // else console.log(`No need to update ${cache.fileIds[aIdx]}`);
  }
}

function attachInputStream(container, versions, genomes, organismId, onCache) {
  const fileIds = genomes.map((_) => _.fileId);
  fileIds.sort();
  const seen = new Set();

  async function* gen() {
    const { cache, stream } = await readScoreCache(versions, organismId, fileIds);
    onCache(cache);

    yield bson.serialize({ genomes });

    let uncachedFileIds = new Set();
    for await (const doc of stream) {
      yield bson.serialize(doc);

      seen.add(doc.fileId);
      for (const fileId of fileIds) {
        if (fileId >= doc.fileId) break;
        if (doc.scores[fileId] === undefined) {
          uncachedFileIds.add(doc.fileId);
          uncachedFileIds.add(fileId);
        }
      }
    }

    for (const fileId of fileIds) {
      if (!seen.has(fileId)) {
        uncachedFileIds = new Set(fileIds);
        break;
      }
    }
    LOGGER.info(`Tree needs ${uncachedFileIds.size} of ${new Set(fileIds).size} genomes`);

    console.time('Create genomes');
    for await (const doc of createGenomesStream(genomes, uncachedFileIds, versions, organismId)) {
      yield bson.serialize(doc);
    }
    console.timeEnd('Create genomes');
  }

  Readable.from(gen()).pipe(container.stdin);
}

async function handleContainerOutput(container, task, versions, metadata, genomes, cachePromise, resolve, reject) {
  const { clientId, name } = metadata;
  request('collection', 'send-progress', { clientId, payload: { task, name, status: 'IN PROGRESS' } });

  const cache = await cachePromise;
  console.dir({ beforeCounts: cache.counts });

  const lines = readline.createInterface({
    input: container.stdout,
    crlfDelay: Infinity,
  });

  let lastProgress = 0;
  let newick;

  for await (const line of lines) {
    if (!line) continue;
    try {
      const doc = JSON.parse(line);
      if (doc.fileId && doc.scores) {
        cache.update(doc);
        const progress = doc.progress * 0.99;
        if ((progress - lastProgress) >= 1) {
          request('collection', 'send-progress', { clientId, payload: { task, name, progress } });
          lastProgress = progress;
        }
      }
      else if (doc.progress) {
        const progress = doc.progress * 0.99;
        if ((progress - lastProgress) >= 1) {
          request('collection', 'send-progress', { clientId, payload: { task, name, progress } });
          lastProgress = progress;
        }
      }
      else {
        newick = doc.newick;
        break;
      }
    } catch (e) {
      request('collection', 'send-progress', { clientId, payload: { task, name, status: 'ERROR' } });
      reject(e);
    }
  }

  let populationSize = 0;
  if (task === 'subtree') {
    for (const { population } of genomes) {
      if (population) {
        populationSize += 1;
      }
    }
  }

  await updateScoreCache(versions, metadata.organismId, cache);

  resolve({
    newick,
    populationSize,
    name: metadata.name,
    size: genomes.length,
    versions,
  });

}

function handleContainerExit(container, task, versions, metadata, reject) {
  const { organismId, collectionId, clientId, name } = metadata;
  let startTime = process.hrtime();

  container.on('spawn', (containerId) => {
    startTime = process.hrtime();
    LOGGER.info('spawn', containerId, 'running task', task, 'for collection', collectionId);
  });

  container.on('exit', (exitCode) => {
    LOGGER.info('exit', exitCode);

    const [ durationS, durationNs ] = process.hrtime(startTime);
    const duration = Math.round(durationS * 1000 + durationNs / 1e6);
    TaskLog.create({ collectionId, task, version: versions.tree, organismId, duration, exitCode });

    if (exitCode !== 0) {
      request('collection', 'send-progress', { clientId, payload: { task, name, status: 'ERROR' } });
      container.stderr.setEncoding('utf8');
      reject(new Error(container.stderr.read()));
    }
  });

  container.on('error', (e) => {
    request('collection', 'send-progress', { clientId, payload: { task, name, status: 'ERROR' } });
    reject(e);
  });
}

function createContainer(spec, metadata, timeout) {
  const { task, version, workers } = spec;
  const { organismId, collectionId } = metadata;

  const container = docker(getImageName(task, version), {
    env: {
      PW_ORGANISM_TAXID: organismId,
      PW_COLLECTION_ID: collectionId,
      PW_WORKERS: workers,
      // TODO: remove old API
      WGSA_ORGANISM_TAXID: organismId,
      WGSA_COLLECTION_ID: collectionId,
      WGSA_WORKERS: workers,
    },
  }, timeout);

  return container;
}

async function runTask(spec, metadata, timeout) {
  console.time('Build tree');
  const { task, version, requires: taskRequires = [] } = spec;
  const coreVersion = taskRequires.find((_) => _.task === 'core').version;
  const versions = { tree: version, core: coreVersion };

  console.time('List genomes');
  const genomes = await getGenomes(task, metadata);
  console.timeEnd('List genomes');
  if (genomes.length <= 1) {
    throw new Error('Not enough genomes to make a tree');
  } else if (genomes.length === 2) {
    return {
      newick: `(${genomes[0]._id}:0.5,${genomes[1]._id}:0.5);`,
      size: 2,
      populationSize: genomes.filter((_) => _.population).length,
      name: metadata.name,
    };
  }

  return new Promise((resolve, reject) => {
    const container = createContainer(spec, metadata, timeout);
    let onCache;
    const cachePromise = new Promise((_) => { onCache = _; });

    handleContainerOutput(container, task, versions, metadata, genomes, cachePromise, (r) => { console.timeEnd('Build tree'); resolve(r); }, (e) => { container.destroy(); reject(e); });

    handleContainerExit(container, task, versions, metadata, reject);

    attachInputStream(container, versions, genomes, metadata.organismId, onCache);
  });
}

module.exports = runTask;

module.exports.handleContainerOutput = handleContainerOutput;
module.exports.handleContainerExit = handleContainerExit;
module.exports.createContainer = createContainer;
