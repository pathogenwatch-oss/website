/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-params: 0 */
/* eslint max-params: 0 */

const slug = require('slug');
const BSON = require('bson');
const { Readable } = require('stream');
const readline = require('readline');

const bson = new BSON();

const store = require('utils/object-store');
const Genome = require('models/genome');
const TaskLog = require('models/taskLog');
const docker = require('services/docker');
const { DEFAULT_TIMEOUT } = require('services/bus');

const { getImageName } = require('manifest.js');
const { request } = require('services');

const LOGGER = require('utils/logging').createLogger('runner');

const DEFAULT_THRESHOLD = 50;

async function getCgmlstKeys({ userId, scheme }) {
  const query = {
    ...Genome.getPrefilterCondition({ user: userId ? { _id: userId } : null }),
    'analysis.cgmlst.scheme': scheme,
  };

  const projection = {
    fileId: 1,
    'analysis.cgmlst.st': 1,
    'analysis.cgmlst.__v': 1,
    'analysis.speciator.organismId': 1,
  };

  const docs = await Genome
    .find(query, projection)
    .lean()
    .cursor();

  const analysisKeys = {};

  for await (const value of docs) {
    const doc = JSON.parse(value);
    const { st, __v: version } = doc.analysis.cgmlst;
    const { fileId } = doc;
    const organismId = doc.analysis.speciator.organismId;
    analysisKeys[st] = store.analysisKey('cgmlst', version, fileId, organismId);
  }

  if (Object.keys(analysisKeys).length < 2) {
    throw new Error('Not enough genomes to cluster');
  }

  return analysisKeys;
}

async function attachInputStream(container, spec, metadata, cgmlstKeys) {
  const { version } = spec;
  const { userId, scheme } = metadata;

  async function* gen() {
    yield bson.serialize({
      STs: Object.keys(cgmlstKeys),
      maxThreshold: DEFAULT_THRESHOLD,
    });

    let clustering = await store.getAnalysis('cgmlst-clustering', `${version}_${scheme}`, userId, undefined);
    if (clustering === undefined) clustering = await store.getAnalysis('cgmlst-clustering', `${version}_${scheme}`, 'public', undefined);
    if (clustering !== undefined) {
      yield bson.serialize(JSON.parse(clustering))
    }

    for await (const value of store.iterGet(Object.values(cgmlstKeys))) {
      const { _id, results } = JSON.parse(value);
      yield bson.serialize({ _id, results });
    }
  }

  Readable.from(gen()).pipe(container.stdin);
}

async function handleContainerOutput(container, spec, metadata) {
  const { task, version } = spec;
  const { taskId, userId } = metadata;

  const lines = readline.createInterface({
    input: container.stdout,
    crlfDelay: Infinity,
  });

  await request('clustering', 'send-progress', { taskId, payload: { task, status: 'IN PROGRESS' } });

  const results = { edges: {} };
  for await (const line of lines) {
    if (!line) continue;
    if (line.indexOf('progress') === -1 && line.indexOf('lambda') === -1) continue;
    try {
      const doc = JSON.parse(data);
      if (doc.progress) {
        const progress = doc.progress * 0.99;
        if ((progress - lastProgress) >= 0.1) {
          await request('clustering', 'send-progress', { taskId, payload: { task, status: 'IN PROGRESS', message: doc.message, progress } });
          lastProgress = progress;
        }
      } else if (doc.STs) {
        const { pi, lambda, STs, edges, threshold } = doc;
        results = {
          pi: results.pi || pi,
          lambda: results.lambda || lambda,
          STs: results.STs || STs,
          edges: { ...results.edges, ...edges },
          threshold: results.threshold || threshold,
        }
      }
    } catch (e) {
      LOGGER.error(e);
      await request('clustering', 'send-progress', { taskId, payload: { task, status: 'ERROR' } });
      throw e;
    }
  }
  await store.putAnalysis('cgmlst-clustering', `${version}_${scheme}`, userId || 'public', undefined, results);
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
  const cgmlstKeys = await getCgmlstKeys(metadata);
  
  const container = createContainer(spec, timeout);
  const whenOutput = handleContainerOutput(container, spec, metadata);
  const whenExit = handleContainerExit(container, spec, metadata);
  await attachInputStream(container, spec, metadata, cgmlstKeys);

  await whenExit;
  const results = await whenOutput;
  return results;
}

module.exports = function handleMessage({ spec, metadata, timeout$: timeout = DEFAULT_TIMEOUT }) {
  return runTask(spec, metadata, timeout);
};
