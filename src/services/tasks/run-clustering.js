/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-params: 0 */
/* eslint max-params: 0 */

const es = require('event-stream');
const BSON = require('bson');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const Genome = require('../../models/genome');
const Analysis = require('../../models/analysis');
const ClusteringCache = require('../../models/clusteringCache');
const TaskLog = require('../../models/taskLog');
const docker = require('../docker');
const { DEFAULT_TIMEOUT } = require('../bus');

const { getImageName } = require('../../manifest.js');
const { request } = require('../../services');

const LOGGER = require('../../utils/logging').createLogger('runner');
const bson = new BSON();

async function getGenomes(spec, metadata) {
  const { userId, scheme } = metadata;

  const query = {
    ...Genome.getPrefilterCondition({ user: userId ? { _id: userId } : null }),
    'analysis.cgmlst.scheme': scheme,
  };

  const docs = await Genome
    .find(query, { 'analysis.cgmlst.st': 1 }, { sort: { 'analysis.cgmlst.st': 1 } })
    .lean();

  if (docs.length < 2) {
    throw new Error('Not enough genomes to cluster');
  }

  return docs;
}

function attachInputStream(container, spec, metadata, genomes, allSts) {
  const { version } = spec;

  const reformatAsGenomeDoc = es.map((doc, cb) => cb(null, { analysis: { cgmlst: doc.results } }));
  const toRaw = es.map((doc, cb) => cb(null, bson.serialize(doc)));

  const docsStream = Analysis
    .find(
      { task: 'cgmlst', 'results.st': { $in: allSts } },
      { results: 1 }
    )
    .lean()
    .cursor()
    .pipe(reformatAsGenomeDoc)
    .pipe(toRaw);
  docsStream.pause();

  const sts = genomes.map(_ => _.analysis.cgmlst.st);

  const projection = { st: 1 };
  for (const st of sts) {
    projection[`alleleDifferences.${st}`] = 1;
  }

  const { scheme } = metadata;
  const scoresStream = ClusteringCache.collection.find(
    { st: { $in: sts }, version, scheme },
    projection,
    { raw: true }
  ).stream();
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
    // .pipe(require('fs').createWriteStream('input.bson'));

  const genomeList = genomes.map(g => ({ _id: g._id, st: g.analysis.cgmlst.st }));
  genomesStream.end(bson.serialize({ genomes: genomeList, thresholds: [ 20, 50, 75, 100, 150, 200 ] }), () => scoresStream.resume());
}

function handleContainerOutput(container, spec, metadata) {
  const { task, version } = spec;
  const { taskId, scheme } = metadata;
  let resolve;
  let reject;
  request('clustering', 'send-progress', { taskId, payload: { task, status: 'IN PROGRESS' } });
  let lastProgress = 0;
  const results = [];
  const output = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  const gfs = Grid(mongoose.connection.db, mongoose.mongo);
  const clusteringcache = gfs.createWriteStream({
    filename: 'clusteringcache',
  });

  clusteringcache.on('error', error => {
    reject(error);
  }).on('close', () => {
    resolve({ results });
  });

  const handler = es.map((data, callback) => {
    if (!data) return callback();
    try {
      const doc = JSON.parse(data);
      if (doc.st && doc.alleleDifferences) {
        const update = {};
        for (const key of Object.keys(doc.alleleDifferences)) {
          update[`alleleDifferences.${key}`] = doc.alleleDifferences[key];
        }
        return callback(null, { st: doc.st, version, scheme, ...update });
      } else if (doc.progress) {
        const progress = doc.progress * 0.99;
        if ((progress - lastProgress) >= 1) {
          return request('clustering', 'send-progress', { taskId, payload: { task, status: 'IN PROGRESS', progress } })
            .then(() => (lastProgress = progress))
            .then(() => callback());
        }
      } else {
        results.push(doc);
        return callback();
      }
    } catch (e) {
      LOGGER.error(e);
      return request('clustering', 'send-progress', { taskId, payload: { task, status: 'ERROR' } })
        .then(() => reject(e));
    }
    return callback();
  });
  container.stdout
    .pipe(es.split())
    .pipe(handler)
    .pipe(es.stringify())
    .pipe(clusteringcache);
  return output;
}

function handleContainerExit(container, spec, metadata) {
  const { task, version } = spec;
  const { userId, scheme, taskId } = metadata;
  let startTime = process.hrtime();
  let resolve;
  let reject;
  const output = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  container.on('spawn', (containerId) => {
    startTime = process.hrtime();
    LOGGER.info('spawn', containerId, 'running task', task);
  });

  container.on('exit', (exitCode) => {
    LOGGER.info('exit', exitCode);

    const [ durationS, durationNs ] = process.hrtime(startTime);
    const duration = Math.round(durationS * 1000 + durationNs / 1e6);
    TaskLog.create({ task, version, userId, scheme, duration, exitCode });

    if (exitCode !== 0) {
      request('clustering', 'send-progress', { taskId, payload: { task, status: 'ERROR' } });
      container.stderr.setEncoding('utf8');
      reject(new Error(container.stderr.read()));
    } else {
      resolve();
    }
  });

  container.on('error', (e) => {
    request('clustering', 'send-progress', { taskId, payload: { task, status: 'ERROR' } });
    reject(e);
  });

  return output;
}

function createContainer(spec, timeout) {
  const { task, version, workers } = spec;

  const container = docker(getImageName(task, version), {
    env: {
      WGSA_WORKERS: workers,
    },
  }, timeout);

  return container;
}

async function runTask(spec, metadata, timeout) {
  const genomes = await getGenomes(spec, metadata);
  const allSts = genomes.map(_ => _.analysis.cgmlst.st);

  const container = createContainer(spec, timeout);
  const whenOutput = handleContainerOutput(container, spec, metadata);
  const whenExit = handleContainerExit(container, spec, metadata);
  attachInputStream(container, spec, metadata, genomes, allSts);

  await whenExit;
  const { results } = await whenOutput;
  return results;
}

module.exports = function handleMessage({ spec, metadata, timeout$: timeout = DEFAULT_TIMEOUT }) {
  return runTask(spec, metadata, timeout);
};
