/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-params: 0 */
/* eslint max-params: 0 */

const es = require('event-stream');
const BSON = require('bson');
const { Writable } = require('stream');
const { ObjectId } = require('mongoose').Types;

const Genome = require('../../models/genome');
const Analysis = require('../../models/analysis');
const Clustering = require('../../models/clustering');
const TaskLog = require('../../models/taskLog');
const docker = require('../docker');
const { DEFAULT_TIMEOUT } = require('../bus');

const { getImageName } = require('../../manifest.js');
const { request } = require('../../services');

const LOGGER = require('../../utils/logging').createLogger('runner');
const bson = new BSON();

const DEFAULT_THRESHOLD = 50;

async function getGenomes(spec, metadata) {
  const { userId, scheme } = metadata;

  const query = {
    ...Genome.getPrefilterCondition({ user: userId ? { _id: userId } : null }),
    'analysis.cgmlst.scheme': scheme,
  };

  const docs = await Genome
    .find(query, { 'analysis.cgmlst.st': 1 })
    .lean();

  if (docs.length < 2) {
    throw new Error('Not enough genomes to cluster');
  }

  return docs;
}

async function attachInputStream(container, spec, metadata, allSts) {
  const { version } = spec;
  const { userId, scheme } = metadata;

  const profilesStream = Analysis
    .find(
      { task: 'cgmlst', 'results.st': { $in: allSts }, 'results.scheme': scheme },
      { results: 1 },
      { raw: true },
    )
    .lean()
    .cursor();
  profilesStream.pause();

  const cluster = await Clustering
    .find(
      { scheme, version, $or: [ { user: userId }, { public: true } ] },
      { _id: 1, relatedBy: 1 }
    )
    .sort({ public: 1 })
    .limit(1);

  let relatedBy;
  if (cluster.length > 0) {
    relatedBy = cluster[0].relatedBy;
  } else {
    relatedBy = new ObjectId();
  }

  const clusteringStream = Clustering
    .find(
      { relatedBy },
      { pi: 1, lambda: 1, STs: 1, threshold: 1, edges: 1 },
      { raw: true }
    )
    .lean()
    .cursor();
  clusteringStream.on('end', () => profilesStream.resume());

  const requestStream = es.through();

  const stream = es.merge(
    requestStream,
    clusteringStream,
    profilesStream
  );

  stream
    .pipe(container.stdin);
    // .pipe(require('fs').createWriteStream('input.bson'));

  const clusteringRequest = {
    STs: allSts,
    maxThreshold: DEFAULT_THRESHOLD,
  };
  requestStream.end(bson.serialize(clusteringRequest), () => clusteringStream.resume());
}

async function handleContainerOutput(container, spec, metadata) {
  const { task, version } = spec;
  const { taskId } = metadata;
  let resolve;
  let reject;
  const output = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  const relatedBy = new ObjectId();
  await request('clustering', 'send-progress', { taskId, payload: { task, status: 'IN PROGRESS' } });
  let lastProgress = 0;
  const consumer = new Writable({
    objectMode: true,
    async write(data, _, callback) {
      if (!data) return callback();
      if (data.indexOf('progress') === -1 && data.indexOf('lambda') === -1) return callback();
      try {
        const doc = JSON.parse(data);
        if (doc.progress) {
          const progress = doc.progress * 0.99;
          if ((progress - lastProgress) >= 0.1) {
            await request('clustering', 'send-progress', { taskId, payload: { task, status: 'IN PROGRESS', message: doc.message, progress } });
            lastProgress = progress;
            return callback();
          }
        } else if (doc.STs) {
          doc.relatedBy = relatedBy;
          await request('clustering', 'save-results', { results: doc, metadata, version });
          return callback();
        }
      } catch (e) {
        LOGGER.error(e);
        await request('clustering', 'send-progress', { taskId, payload: { task, status: 'ERROR' } });
        reject(e);
        return callback(e);
      }
      return callback();
    },
    final(callback) {
      resolve({ relatedBy });
      return callback();
    },
  });
  container.stdout
    .pipe(es.split())
    .pipe(consumer);
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
  const { task, version } = spec;

  LOGGER.debug(`Starting container of ${task}:${version}`);
  const container = docker(getImageName(task, version), {}, timeout);

  return container;
}

async function runTask(spec, metadata, timeout) {
  const genomes = await getGenomes(spec, metadata);
  const allSts = [ ...new Set(genomes.map(_ => _.analysis.cgmlst.st)) ];

  const container = createContainer(spec, timeout);
  const whenOutput = handleContainerOutput(container, spec, metadata);
  const whenExit = handleContainerExit(container, spec, metadata);
  await attachInputStream(container, spec, metadata, allSts);

  await whenExit;
  const results = await whenOutput;
  return results;
}

module.exports = function handleMessage({ spec, metadata, timeout$: timeout = DEFAULT_TIMEOUT }) {
  return runTask(spec, metadata, timeout);
};
