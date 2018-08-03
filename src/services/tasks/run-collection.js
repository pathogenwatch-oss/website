/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-params: 0 */
/* eslint max-params: 0 */

const es = require('event-stream');
const BSON = require('bson');

const Analysis = require('models/analysis');
const Collection = require('../../models/collection');
const Genome = require('../../models/genome');
const ScoreCache = require('../../models/scoreCache');
const TaskLog = require('../../models/taskLog');
const docker = require('../docker');
const { DEFAULT_TIMEOUT } = require('../bus');

const { getImageName } = require('../../manifest.js');
const { request } = require('../../services');

const LOGGER = require('../../utils/logging').createLogger('runner');
const bson = new BSON();

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

function getGenomesInCache(genomes, versions) {
  return ScoreCache.find(
    { fileId: { $in: genomes.map(_ => _.fileId) }, 'versions.core': versions.core, 'versions.tree': versions.tree },
    genomes.reduce(
      (projection, { fileId }) => {
        projection[`scores.${fileId}`] = 1;
        return projection;
      },
      { fileId: 1 }
    ),
    { sort: { fileId: 1 } }
  )
  .then(docs => {
    const cacheByFileId = {};
    for (const doc of docs) {
      cacheByFileId[doc.fileId] = doc.scores;
    }

    const missingFileIds = new Set();
    for (let i = genomes.length - 1; i > 0; i--) {
      if (genomes[i].fileId in cacheByFileId) {
        for (let j = 0; j < i; j++) {
          if (!(genomes[j].fileId in cacheByFileId[genomes[i].fileId])) {
            missingFileIds.add(genomes[i].fileId);
            missingFileIds.add(genomes[j].fileId);
          }
        }
      } else {
        missingFileIds.add(genomes[i].fileId);
        for (let j = 0; j < i; j++) {
          missingFileIds.add(genomes[j].fileId);
        }
      }
    }

    return Array.from(missingFileIds);
  });
}

function createGenomesStream(genomes, uncachedFileIds, versions) {
  const genomeLookup = genomes.reduce((acc, genome) => {
    const { fileId } = genome;
    if (uncachedFileIds.indexOf(fileId) === -1) return acc;
    acc[fileId] = acc[fileId] || [];
    acc[fileId].push(genome);
    return acc;
  }, {});

  const cores = Analysis.find({
    fileId: { $in: uncachedFileIds },
    task: 'core',
    version: versions.core,
  }, {
    fileId: 1,
    'results.profile.filter': 1,
    'results.profile.alleles.filter': 1,
    'results.profile.id': 1,
    'results.profile.alleles.id': 1,
    'results.profile.alleles.rstart': 1,
    'results.profile.alleles.rstop': 1,
    'results.profile.alleles.mutations': 1,
  }).sort({ fileId: 1 }).lean().cursor();

  const reformatCores = es.through(function (core) {
    const { fileId, results } = core;
    genomeLookup[fileId] = genomeLookup[fileId] || [];
    for (const genomeDetails of genomeLookup[fileId]) {
      const genome = {
        ...genomeDetails,
        analysis: { core: results },
      };
      this.emit('data', genome);
    }
    genomeLookup[fileId] = [];
  });

  const toRaw = es.map((doc, cb) => cb(null, bson.serialize(doc)));
  return cores.pipe(reformatCores).pipe(toRaw);
}

function attachInputStream(container, versions, genomes, uncachedFileIds) {
  const docsStream = createGenomesStream(genomes, uncachedFileIds, versions);
  docsStream.pause();
  // docsStream.on('end', () => console.log('docs ended'));

  const scoresStream = ScoreCache.collection.find(
    { fileId: { $in: genomes.map(_ => _.fileId) }, 'versions.core': versions.core, 'versions.tree': versions.tree },
    genomes.reduce((projection, { fileId }) => {
      projection[`scores.${fileId}`] = 1;
      return projection;
    }, { fileId: 1 }),
    { raw: true, sort: { fileId: 1 } }
  );
  scoresStream.pause();
  scoresStream.on('end', () => docsStream.resume());

  const genomesStream = es.through();

  const stream = es.merge(
    genomesStream,
    scoresStream,
    docsStream
  );

  stream
    .pipe(container.stdin);
    // .pipe(require('fs').createWriteStream('tree-input.bson'));

  genomesStream.end(bson.serialize({ genomes }), () => scoresStream.resume());
}

function handleContainerOutput(container, task, versions, metadata, genomes, resolve, reject) {
  const { clientId, name } = metadata;
  request('collection', 'send-progress', { clientId, payload: { task, name, status: 'IN PROGRESS' } });
  let lastProgress = 0;
  container.stdout
    .pipe(es.split())
    .on('data', (data) => {
      if (!data) return;
      try {
        const doc = JSON.parse(data);
        if (doc.fileId && doc.scores) {
          const update = {};
          for (const key of Object.keys(doc.scores)) {
            update[`scores.${key}`] = doc.scores[key];
          }
          for (const key of Object.keys(doc.differences)) {
            update[`differences.${key}`] = doc.differences[key];
          }
          ScoreCache.update({ fileId: doc.fileId, 'versions.core': versions.core, 'versions.tree': versions.tree }, update, { upsert: true }).exec();
          const progress = doc.progress * 0.99;
          if ((progress - lastProgress) >= 1) {
            request('collection', 'send-progress', { clientId, payload: { task, name, progress } });
            lastProgress = progress;
          }
        } else {
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
      WGSA_ORGANISM_TAXID: organismId,
      WGSA_COLLECTION_ID: collectionId,
      WGSA_WORKERS: workers,
    },
  }, timeout);

  return container;
}

async function runTask(spec, metadata, timeout) {
  const { task, version, requires: taskRequres = [] } = spec;
  const coreVersion = taskRequres.find(_ => _.task === 'core').version;
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

  const uncachedFileIds = await getGenomesInCache(genomes, versions);

  return new Promise((resolve, reject) => {
    const container = createContainer(spec, metadata, timeout);

    handleContainerOutput(container, task, versions, metadata, genomes, resolve, reject);

    handleContainerExit(container, task, versions, metadata, reject);

    attachInputStream(container, versions, genomes, uncachedFileIds);
  });
}

module.exports = function handleMessage({ spec, metadata, timeout$: timeout = DEFAULT_TIMEOUT }) {
  return runTask(spec, metadata, timeout);
};
