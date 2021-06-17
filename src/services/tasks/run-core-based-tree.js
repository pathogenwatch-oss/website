/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-params: 0 */
/* eslint max-params: 0 */

const BSON = require('bson');

const bson = new BSON();
const { Readable, Writable } = require('stream');
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
  const sortedFileIds = [ ...fileIds ];
  sortedFileIds.sort();

  const analysisKeys = sortedFileIds.map((fileId) => store.analysisKey('core-tree-score', `${versions.core}_${versions.tree}`, fileId, undefined));

  const fileIdLookup = {};
  sortedFileIds.forEach((fileId, i) => { fileIdLookup[fileId] = i; });

  const nScores = (sortedFileIds.length * (sortedFileIds.length - 1)) / 2;
  const cache = {
    scores: new Uint32Array(nScores),
    differences: new Uint32Array(nScores),
    locations: new Uint16Array(nScores), // Make a note of which cache document this score was found in
    fileIds: sortedFileIds,
    counts: new Uint16Array(sortedFileIds.length), // The number of scores which are stored in each document
    savePreference: new Uint8Array(sortedFileIds.length), // A number 0-3 recording which documents we'd rather grow
    update: (doc, saveLocation = false) => {
      const aIdx = fileIdLookup[doc.fileId];
      if (aIdx === undefined) return;
      for (const fileId in doc.scores) { // eslint-disable-line guard-for-in
        const bIdx = fileIdLookup[fileId];
        if (bIdx === undefined) continue;
        const idx = aIdx < bIdx ? (bIdx * (bIdx - 1) / 2) + aIdx : (aIdx * (aIdx - 1) / 2) + bIdx;
        cache.scores[idx] = doc.scores[fileId];
        cache.differences[idx] = doc.differences[fileId];
        if (saveLocation) cache.locations[idx] = aIdx; // We save the location if this comes from the cache
      }
    },
  };
  cache.scores.fill(EMPTY_SCORE);
  cache.differences.fill(EMPTY_SCORE);
  cache.locations.fill(EMPTY_LOCATION);

  let idxA = -1;
  // Download cache documents and load them
  for await (const value of store.iterGet(analysisKeys)) {
    idxA += 1;
    if (value === undefined) continue;
    const doc = JSON.parse(value);
    cache.counts[idxA] = Object.keys(doc.scores).length;
    cache.update(doc, true);
  }

  // Walk through the cache and emit documents needed for tree building
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
  }

  return { cache, stream: cacheDocs() };
}

function planCacheLocations(cache) {
  // We need to write scores back into the cache.  Its better if:
  // * documents don't get too big / are balanced
  // * we avoid updating documents unless we really need to

  // We set a preference score for each document to arbitrate which document a score goes into:
  //  Up to half the docs have preference 3 if they're new; or 1 if they're not
  //  The other half have 2 if they're new; or 0 if they're not
  //  Docs are ordered by the number of scores they already contain

  const sortedIndex = new Uint16Array(cache.fileIds.length);
  for (let i = 0; i < cache.fileIds.length; i++) sortedIndex[i] = i;
  sortedIndex.sort((a, b) => (cache.counts[a] < cache.counts[b] ? -1 : 1));
  for (let i = 0; i < cache.fileIds.length; i++) {
    const idx = sortedIndex[i];
    if (i < cache.fileIds.length / 2) {
      if (cache.counts[idx] === 0) cache.savePreference[idx] = 3;
      else cache.savePreference[idx] = 1;
    }
    else if (cache.counts[idx] === 0) cache.savePreference[idx] = 2;
    else cache.savePreference[idx] = 0;
  }

  // We also keep track of which documents were updated and need to be saved
  cache.wasUpdated = new Uint8Array(cache.fileIds.length);
  for (let offset = 1; offset < cache.fileIds.length; offset++) {
    for (let aIdx = 0; aIdx < cache.fileIds.length; aIdx++) {
      const bIdx = (aIdx + offset) % cache.fileIds.length;
      const idx = aIdx < bIdx ? (bIdx * (bIdx - 1) / 2) + aIdx : (aIdx * (aIdx - 1) / 2) + bIdx;
      const currentLocation = cache.locations[idx];

      // The score is not already in the cache
      if (currentLocation === EMPTY_LOCATION) {
        let newLocation = aIdx;
        // Add the score to the prefered doc unless that makes things very imbalanced
        if (
          (cache.savePreference[aIdx] > cache.savePreference[bIdx]) &&
          (cache.counts[aIdx] < (cache.counts[bIdx] + 20))
        ) {
          newLocation = aIdx;
        }
        // Or to the other doc if that is prefered
        else if (
          (cache.savePreference[bIdx] > cache.savePreference[aIdx]) &&
          (cache.counts[bIdx] < (cache.counts[aIdx] + 20))
        ) {
          newLocation = bIdx;
        }
        // Otherwise we add the score to the smaller doc
        else if (cache.counts[aIdx] > cache.counts[bIdx]) {
          newLocation = bIdx;
        }
        cache.locations[idx] = newLocation;
        cache.counts[newLocation] += 1;
        cache.wasUpdated[newLocation] = true;

      }

      // The score was in the cache already, but perhaps we can rebalance things
      else if (currentLocation === aIdx && (cache.counts[aIdx] > (cache.counts[bIdx] + 20))) {
        cache.locations[idx] = bIdx;
        cache.counts[aIdx] -= 1;
        cache.counts[bIdx] += 1;
        cache.wasUpdated[aIdx] = true;
        cache.wasUpdated[bIdx] = true;
      }

      // Or the other way
      else if (currentLocation === bIdx && (cache.counts[bIdx] > (cache.counts[aIdx] + 20))) {
        cache.locations[idx] = aIdx;
        cache.counts[aIdx] += 1;
        cache.counts[bIdx] -= 1;
        cache.wasUpdated[aIdx] = true;
        cache.wasUpdated[bIdx] = true;
      }
    }
  }

  let idx = -1;
  // Looping over the scores again helps rebalance the cache
  for (let aIdx = 0; aIdx < cache.fileIds.length; aIdx++) {
    for (let bIdx = 0; bIdx < aIdx; bIdx++) {
      idx += 1;
      const currentLocation = cache.locations[idx];
      if (currentLocation === aIdx && (cache.counts[aIdx] > (cache.counts[bIdx] + 20))) {
        cache.locations[idx] = bIdx;
        cache.counts[aIdx] -= 1;
        cache.counts[bIdx] += 1;
        cache.wasUpdated[aIdx] = true;
        cache.wasUpdated[bIdx] = true;
      } else if (currentLocation === bIdx && (cache.counts[bIdx] > (cache.counts[aIdx] + 20))) {
        cache.locations[idx] = aIdx;
        cache.counts[aIdx] += 1;
        cache.counts[bIdx] -= 1;
        cache.wasUpdated[aIdx] = true;
        cache.wasUpdated[bIdx] = true;
      }
    }
  }
}

async function updateScoreCache(versions, cache) {
  planCacheLocations(cache);

  let updated = 0;
  for (let aIdx = 0; aIdx < cache.fileIds.length; aIdx += 1) {
    if (!cache.wasUpdated[aIdx]) continue;
    const fileId = cache.fileIds[aIdx];

    // Fetch the existing cache for this fileId
    const value = await store.getAnalysis('core-tree-score', `${versions.core}_${versions.tree}`, fileId, undefined);
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
          update.scores[fileIdB] = score;
          cache.wasUpdated[aIdx] = true;
        }
        if (difference !== EMPTY_SCORE && update.differences[fileIdB] !== difference) {
          update.differences[fileIdB] = difference;
          cache.wasUpdated[aIdx] = true;
        }
      } else {
        if (update.scores[fileIdB] !== undefined) {
          delete update.scores[fileIdB];
          cache.wasUpdated[aIdx] = true;
        }
        if (update.differences[fileIdB] !== undefined) {
          delete update.differences[fileIdB];
          cache.wasUpdated[aIdx] = true;
        }
      }
    }

    if (cache.wasUpdated[aIdx]) {
      await store.putAnalysis('core-tree-score', `${versions.core}_${versions.tree}`, fileId, undefined, update);
      updated += 1;
    }
  }
  LOGGER.info(`Updated ${updated} of ${cache.fileIds.length} documents (${Math.round(100 * updated / cache.fileIds.length)}%)`);
}

async function attachInputStream(container, versions, genomes, organismId, onCache) {
  const fileIds = genomes.map((_) => _.fileId);
  fileIds.sort();
  const seen = new Set();

  const { cache, stream } = await readScoreCache(versions, organismId, fileIds);
  onCache(cache);

  async function* gen() {
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

    for await (const doc of createGenomesStream(genomes, uncachedFileIds, versions, organismId)) {
      yield bson.serialize(doc);
    }
  }

  Readable.from(gen()).pipe(container.stdin);
}

async function handleContainerOutput(container, task, versions, metadata, genomes, cachePromise, resolve, reject) {
  const { clientId, name } = metadata;
  request('collection', 'send-progress', { clientId, payload: { task, name, status: 'IN PROGRESS' } });

  const cache = await cachePromise;

  const lines = readline.createInterface({
    input: container.stdout,
    crlfDelay: Infinity,
  });

  let lastProgress = 0;
  let newick;

  const handler = new Writable({
    objectMode: true,
    async write(line, _, done) {
      if (!line) return done();
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
          return done();
        }
      } catch (e) {
        request('collection', 'send-progress', { clientId, payload: { task, name, status: 'ERROR' } });
        reject(e);
      }
    }
  })

  handler.on('close', async () => {
    let populationSize = 0;
    if (task === 'subtree') {
      for (const { population } of genomes) {
        if (population) {
          populationSize += 1;
        }
      }
    }

    try {
      await updateScoreCache(versions, cache);
    } catch (e) {
      request('collection', 'send-progress', { clientId, payload: { task, name, status: 'ERROR' } });
      reject(e);
    }

    resolve({
      newick,
      populationSize,
      name: metadata.name,
      size: genomes.length,
      versions,
    });
  })
  Readable.from(lines).pipe(handler);
}

async function handleContainerExit(container, task, versions, metadata, reject) {
  const { organismId, collectionId, clientId, name } = metadata;

  await container.start();
  const startTime = process.hrtime();
  LOGGER.info('spawn', container.id, 'running task', task, 'for collection', collectionId);

  const { StatusCode: statusCode } = await container.wait();
  LOGGER.info('exit', exitCode);

  const [ durationS, durationNs ] = process.hrtime(startTime);
  const duration = Math.round(durationS * 1000 + durationNs / 1e6);
  TaskLog.create({ collectionId, task, version: versions.tree, organismId, duration, exitCode });

  if (exitCode !== 0) {
    request('collection', 'send-progress', { clientId, payload: { task, name, status: 'ERROR' } });
    container.stderr.setEncoding('utf8');
    reject(new Error(container.stderr.read()));
  }
}

function createContainer(spec, metadata, timeout, resources) {
  const { task, version, workers } = spec;
  const { organismId, collectionId } = metadata;

  const container = docker(
    getImageName(task, version),
    {
      PW_ORGANISM_TAXID: organismId,
      PW_COLLECTION_ID: collectionId,
      PW_WORKERS: workers,
      // TODO: remove old API
      WGSA_ORGANISM_TAXID: organismId,
      WGSA_COLLECTION_ID: collectionId,
      WGSA_WORKERS: workers,
    },
    timeout,
    resources,
  );

  return container;
}

async function runTask(spec, metadata, timeout) {
  const { task, version, requires: taskRequires = [], resources={} } = spec;
  const coreVersion = taskRequires.find((_) => _.task === 'core').version;
  const versions = { tree: version, core: coreVersion };

  const genomes = await getGenomes(task, metadata);
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
    const container = createContainer(spec, metadata, timeout, resources);
    let onCache;
    const cachePromise = new Promise((_) => { onCache = _; });

    handleContainerOutput(container, task, versions, metadata, genomes, cachePromise, resolve, (e) => { container.destroy(); reject(e); });

    handleContainerExit(container, task, versions, metadata, reject);

    attachInputStream(container, versions, genomes, metadata.organismId, onCache);
  });
}

module.exports = runTask;

module.exports.handleContainerOutput = handleContainerOutput;
module.exports.handleContainerExit = handleContainerExit;
module.exports.createContainer = createContainer;
