/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-params: 0 */
/* eslint max-params: 0 */

const es = require('event-stream');
const BSON = require('bson');
const { Writable } = require('stream');

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
    .find(query, { 'analysis.cgmlst.st': 1 })
    .lean();

  if (docs.length < 2) {
    throw new Error('Not enough genomes to cluster');
  }

  return docs;
}

function attachInputStream(container, spec, metadata, genomes, allSts) {
  const { version } = spec;
  const { scheme } = metadata;

  const docsStream = Analysis
    .find(
      { task: 'cgmlst', 'results.st': { $in: allSts }, 'results.scheme': scheme },
      { results: 1 },
      { raw: true },
    )
    .lean()
    .cursor();
  docsStream.pause();

  const projection = { st: 1 };
  for (const st of allSts) {
    projection[`alleleDifferences.${st}`] = 1;
  }

  const scoresStream = ClusteringCache.collection.find(
    { st: { $in: allSts }, version, scheme },
    projection,
    { raw: true }
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
    // .pipe(require('fs').createWriteStream('input.bson'));

  const genomeList = genomes.map(g => ({ _id: g._id, st: g.analysis.cgmlst.st }));
  genomesStream.end(bson.serialize({ genomes: genomeList, thresholds: [ 1, 2, 3, 5, 10, 20, 50 ] }), () => scoresStream.resume());
}

function handleContainerOutput(container, spec, metadata) {
  const { task, version } = spec;
  const { taskId, scheme } = metadata;
  let resolve;
  let reject;
  const output = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  request('clustering', 'send-progress', { taskId, payload: { task, status: 'IN PROGRESS' } });
  let lastProgress = 0;
  const results = [];
  const cache = [];
  const consumer = new Writable({
    objectMode: true,
    write(data, _, callback) {
      if (!data) return callback();
      try {
        const doc = JSON.parse(data);
        if (doc.st && doc.alleleDifferences) {
          return ClusteringCache.create({ st: doc.st, version, scheme, alleleDifferences: doc.alleleDifferences })
            .then(() => callback())
            .catch(error => reject(error));
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
    },
    final(callback) {
      resolve({ results, cache });
      callback();
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
  attachInputStream(container, spec, metadata, genomes, allSts);

  await whenExit;
  const { results } = await whenOutput;
  return results;
}

module.exports = function handleMessage({ spec, metadata, timeout$: timeout = DEFAULT_TIMEOUT }) {
  return runTask(spec, metadata, timeout);
};
