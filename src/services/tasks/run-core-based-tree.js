/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-params: 0 */
/* eslint max-params: 0 */

const BSON = require('bson');
const bson = new BSON();
const { Readable } = require('stream');
const readline = require('readline');

const Collection = require('../../models/collection');
const Genome = require('../../models/genome');
const TaskLog = require('../../models/taskLog');
const docker = require('../docker');
const store = require('../../utils/object-store');

const { getImageName } = require('../../manifest.js');
const { request } = require('../../services');

const LOGGER = require('../../utils/logging').createLogger('runner');

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

  const ids = new Set(genomes.map(_ => _.toString()));

  return docs.map(({ _id, fileId, name }) => ({
    _id,
    fileId,
    name,
    population: !ids.has(_id.toString()),
  }));
}

async function* createGenomesStream(genomes, uncachedFileIds, versions, organismId) {
  const genomeLookup = {}
  for (const genome of genomes) {
    const { fileId } = genome;
    if (!uncachedFileIds.has(fileId)) continue;
    genomeLookup[fileId] = genomeLookup[fileId] || [];
    genomeLookup[fileId].push(genome);
  }

  const fileIds = Array.from(uncachedFileIds);
  fileIds.sort()

  const analysisKeys = fileIds.map(fileId => store.analysisKey('core', versions.core, fileId, organismId))
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

async function* createScoreCacheStream(versions, organismId, fileIds) {
  const analysisKeys = fileIds.map(fileId => store.analysisKey('tree-score', `${versions.core}_${versions.tree}`, fileId, organismId))
  function formater(doc) {
    out = { fileId: doc.fileId, scores: {} }
    for (const fileId of fileIds) {
      if (doc.scores[fileId] !== undefined) out.scores[fileId] = doc.scores[fileId]
    }
    return out
  }
  const cache = store.iterGet(analysisKeys);
  for (let i=0; i<fileIds.length; i++) {
    const { value, done } = await cache.next();
    if (done) break;
    if (value === undefined) {
      const fileId = fileIds[i];
      yield { fileId, scores: {} };
    } else yield formater(JSON.parse(value))
  }
}

function attachInputStream(container, versions, genomes, organismId) {
  const fileIds = genomes.map(_ => _.fileId);
  fileIds.sort();
  const seen = new Set();

  async function* gen() {
    yield bson.serialize({ genomes })
    
    let uncachedFileIds = new Set();
    for await (const doc of createScoreCacheStream(versions, organismId, fileIds)) {
      yield bson.serialize(doc)
      
      seen.add(doc.fileId)
      for (const fileId of fileIds) {
        if (fileId >= doc.fileId) break;
        if (doc.scores[fileId] === undefined) {
          uncachedFileIds.add(doc.fileId)
          uncachedFileIds.add(fileId)
        }
      }
    }

    for (const fileId of fileIds) {
      if (!seen.has(fileId)) {
        uncachedFileIds = new Set(fileIds);
        break;
      }
    }
    LOGGER.info(`Tree needs ${uncachedFileIds.size} of ${new Set(fileIds).size} genomes`)
    
    for await (const doc of createGenomesStream(genomes, uncachedFileIds, versions, organismId)) {
      yield bson.serialize(doc);
    }
  }

  Readable.from(gen()).pipe(container.stdin)
}

async function handleContainerOutput(container, task, versions, metadata, genomes, resolve, reject) {
  const { clientId, name } = metadata;
  request('collection', 'send-progress', { clientId, payload: { task, name, status: 'IN PROGRESS' } });
  
  const lines = readline.createInterface({
    input: container.stdout,
    crlfDelay: Infinity
  });
  
  let lastProgress = 0;

  for await (const line of lines) {
    if (!line) continue;
    try {
      const doc = JSON.parse(line);
      if (doc.fileId && doc.scores) {
        const value = await store.getAnalysis('tree-score', `${versions.core}_${versions.tree}`, doc.fileId, metadata.organismId);
        const update = value === undefined ? { fileId: doc.fileId, scores: {}, differences: {} } : JSON.parse(value);
        update.versions = versions;
        for (const fileId in doc.scores) {
          update.scores[fileId] = doc.scores[fileId];
        }
        for (const fileId in doc.differences) {
          update.differences[fileId] = doc.differences[fileId];
        }
        await store.putAnalysis('tree-score', `${versions.core}_${versions.tree}`, doc.fileId, metadata.organismId, update)
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
        let populationSize = 0;
        if (task === 'subtree') {
          for (const { population } of genomes) {
            if (population) {
              populationSize++;
            }
          }
        }
        const { newick } = doc;
        resolve({
          newick,
          populationSize,
          name: metadata.name,
          size: genomes.length,
          versions,
        });
      }
    } catch (e) {
      request('collection', 'send-progress', { clientId, payload: { task, name, status: 'ERROR' } });
      reject(e);
    }
  }
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
  const { task, version, requires: taskRequires = [] } = spec;
  const coreVersion = taskRequires.find(_ => _.task === 'core').version;
  const versions = { tree: version, core: coreVersion };

  const genomes = await getGenomes(task, metadata);
  if (genomes.length <= 1) {
    throw new Error('Not enough genomes to make a tree');
  } else if (genomes.length === 2) {
    return {
      newick: `(${genomes[0]._id}:0.5,${genomes[1]._id}:0.5);`,
      size: 2,
      populationSize: genomes.filter(_ => _.population).length,
      name: metadata.name,
    };
  }

  return new Promise((resolve, reject) => {
    const container = createContainer(spec, metadata, timeout);

    handleContainerOutput(container, task, versions, metadata, genomes, resolve, reject);

    handleContainerExit(container, task, versions, metadata, reject);

    attachInputStream(container, versions, genomes, metadata.organismId);
  });
}

module.exports = runTask;

module.exports.handleContainerOutput = handleContainerOutput;
module.exports.handleContainerExit = handleContainerExit;
module.exports.createContainer = createContainer;
