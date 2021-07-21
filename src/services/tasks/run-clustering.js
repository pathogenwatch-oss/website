/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint max-params: 0 */

const slug = require('slug');
const BSON = require('bson');
const { Readable, Writable } = require('stream');
const readline = require('readline');

const bson = new BSON();

const store = require('utils/object-store');
const Genome = require('models/genome');
const TaskLog = require('models/taskLog');
const docker = require('services/docker');

const { getImageName } = require('manifest.js');
const { request } = require('services');

const { ServiceRequestError } = require('utils/errors');
const LOGGER = require('utils/logging').createLogger('runner');

const DEFAULT_THRESHOLD = 50;

function getPrefix(key) {
  const parts = key.split('/');
  return `${parts.slice(0, parts.length - 1).join('/')}/`;
}

async function removeMissingKeys(analysisKeys) {
  const prefixes = new Set();
  const missing = new Set(Object.values(analysisKeys));
  for (const key of Object.values(analysisKeys)) {
    prefixes.add(getPrefix(key));
  }

  for (const prefix of prefixes) {
    for await (const { Key: key } of store.list(prefix)) {
      missing.delete(key);
    }
  }

  LOGGER.warn(`Missing cgmlst: ${[...missing].join(', ')}`);

  for (const st of Object.keys(analysisKeys)) {
    if (missing.has(analysisKeys[st])) delete analysisKeys[st];
  }
}

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

  for await (const doc of docs) {
    const { st, __v: version } = doc.analysis.cgmlst;
    const { fileId } = doc;
    const organismId = doc.analysis.speciator.organismId;
    analysisKeys[st] = store.analysisKey('cgmlst', version, fileId, organismId);
  }

  await removeMissingKeys(analysisKeys);

  if (Object.keys(analysisKeys).length < 2) {
    throw new Error('Not enough genomes to cluster');
  }

  return analysisKeys;
}

function attachInputStream(container, spec, metadata, cgmlstKeys) {
  const { userId = 'public', scheme } = metadata;
  const { version } = spec;

  async function* gen() {
    yield bson.serialize({
      STs: Object.keys(cgmlstKeys),
      maxThreshold: DEFAULT_THRESHOLD,
    });

    const clustering = await request('clustering', 'cluster-details', { scheme, version, userId });
    if (clustering !== undefined && clustering !== null) {
      yield bson.serialize(clustering);
    }

    let idx = -1;
    const keys = Object.values(cgmlstKeys);
    for await (const value of store.iterGet(keys)) {
      idx += 1;
      try {
        if (value === undefined) throw new ServiceRequestError('Cannot cluster because a cgmlst profile is missing');
        const { _id, results } = JSON.parse(value);
        yield bson.serialize({ _id, results });
      } catch (err) {
        LOGGER.error(`Cluster error: ${keys[idx]}`);
        throw err;
      }
    }
  }

  const inputStream = Readable.from(gen());
  inputStream.on('error', (err) => {
    LOGGER.error(err);
    container.kill();
  });
  inputStream.pipe(container.stdin);
}

async function handleContainerOutput(container, spec, metadata) {
  const { task } = spec;
  const { taskId } = metadata;

  const lines = readline.createInterface({
    input: container.stdout,
    crlfDelay: Infinity,
  });

  await request('clustering', 'send-progress', { taskId, payload: { task, status: 'IN PROGRESS' } });

  const results = { edges: {} };
  const hasContent = (a) => Array.isArray(a) && a.length > 0;

  let lastProgress = 0;

  const handler = new Writable({
    objectMode: true,
    async write(line, _, done) {
      if (!line) return done();
      if (line.indexOf('progress') === -1 && line.indexOf('lambda') === -1) return done();
      try {
        const doc = JSON.parse(line);
        if (doc.progress) {
          const progress = doc.progress * 0.99;
          if ((progress - lastProgress) >= 0.1) {
            await request('clustering', 'send-progress', { taskId, payload: { task, status: 'IN PROGRESS', message: doc.message, progress } });
            lastProgress = progress;
          }
        } else if ((doc.STs !== undefined) || (doc.edges !== undefined)) {
          results.edges = { ...doc.edges, ...results.edges };
          results.threshold = results.threshold || doc.threshold;
          if (hasContent(doc.pi)) results.pi = doc.pi;
          if (hasContent(doc.lambda)) results.lambda = doc.lambda;
          if (hasContent(doc.STs)) results.STs = doc.STs;
        }
        return done();
      } catch (e) {
        LOGGER.error(e);
        await request('clustering', 'send-progress', { taskId, payload: { task, status: 'ERROR' } });
        return done(e);
      }
    },
  });

  Readable.from(lines).pipe(handler);
  await container.wait();
  return results;
}

async function uploadResults(results, spec, metadata) {
  const { version } = spec;
  const { userId, scheme } = metadata;
  const fullVersion = `${version}-${slug(scheme, { lower: true })}`;
  await store.putAnalysis('cgmlst-clustering', fullVersion, userId ? userId.toString() : 'public', undefined, results);
}

async function handleContainerExit(container, spec, metadata) {
  const { task, version, resources } = spec;
  const { userId, scheme, taskId } = metadata;

  await container.start();
  const startTime = process.hrtime();
  LOGGER.info('spawn', container.id, 'running task', task);

  const { StatusCode: statusCode } = await container.wait();

  LOGGER.info('exit', statusCode);

  const [ durationS, durationNs ] = process.hrtime(startTime);
  const duration = Math.round(durationS * 1000 + durationNs / 1e6);
  TaskLog.create({ task, version, userId, scheme, duration, statusCode, resources });

  if (statusCode !== 0) {
    await request('clustering', 'send-progress', { taskId, payload: { task, status: 'ERROR' } });
    container.stderr.setEncoding('utf8');
    throw new Error(container.stderr.read());
  }

  return statusCode;
}

const random = () => Math.random().toString(36).slice(2, 10);

function createContainer(spec, timeout, resources = {}) {
  const { task, version } = spec;
  LOGGER.debug(`Starting container of ${task}:${version}`);
  return docker(getImageName(task, version), {}, timeout, resources, { name: `clustering_${random()}` });
}

async function runTask(spec, metadata, timeout, resources) {
  const cgmlstKeys = await getCgmlstKeys(metadata);

  const container = await createContainer(spec, timeout, resources);
  const whenResults = handleContainerOutput(container, spec, metadata);
  attachInputStream(container, spec, metadata, cgmlstKeys);
  const statusCode = await handleContainerExit(container, spec, metadata);

  const results = await whenResults;
  if (container.timeout) throw new Error('timeout');
  else if (statusCode === 137) throw new Error('killed');
  await uploadResults(results, spec, metadata);
  return statusCode;
}

module.exports = async function handleMessage({ spec, metadata, resources }) {
  const { taskId } = metadata;
  const { task, timeout } = spec;
  try {
    const statusCode = await runTask(spec, metadata, timeout, resources);
    return { statusCode };
  } catch (error) {
    request('clustering', 'send-progress', { taskId, payload: { task, status: 'ERROR' } });
    throw error;
  }
};
