/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-params: 0 */
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

  for await (const doc of docs) {
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

    for await (const value of store.iterGet(Object.values(cgmlstKeys))) {
      const { _id, results } = JSON.parse(value);
      yield bson.serialize({ _id, results });
    }
  }

  Readable.from(gen()).pipe(container.stdin);
}

async function handleContainerOutput(container, spec, metadata) {
  const { task, version } = spec;
  const { taskId, userId, scheme } = metadata;

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
        } else if (doc.STs) {
          results.edges = { ...doc.edges, ...results.edges };
          results.threshold = results.threshold || doc.threshold;
          if (hasContent(doc.pi)) results.pi = doc.pi;
          if (hasContent(doc.lambda)) results.lambda = doc.lambda;
          if (hasContent(doc.STs)) results.STs = doc.STs;
        }
      } catch (e) {
        LOGGER.error(e);
        await request('clustering', 'send-progress', { taskId, payload: { task, status: 'ERROR' } });
        return done(e);
      }
    }
  })

  handler.on('error', () => {});
  handler.on('close', () => {
    const fullVersion = `${version}-${slug(scheme, { lower: true })}`;
    await store.putAnalysis('cgmlst-clustering', fullVersion, userId ? userId.toString() : 'public', undefined, results);
  })
  Readable.from(lines).pipe(handler)
}

async function handleContainerExit(container, spec, metadata) {
  const { task, version } = spec;
  const { userId, scheme, taskId } = metadata;

  await container.start();
  startTime = process.hrtime();
  LOGGER.info('spawn', container.id, 'running task', task);

  const { StatusCode: statusCode } = await container.wait()

  LOGGER.info('exit', statusCode);

  const [ durationS, durationNs ] = process.hrtime(startTime);
  const duration = Math.round(durationS * 1000 + durationNs / 1e6);
  TaskLog.create({ task, version, userId, scheme, duration, statusCode });

  if (statusCode !== 0) {
    await request('clustering', 'send-progress', { taskId, payload: { task, status: 'ERROR' } });
    container.stderr.setEncoding('utf8');
    throw new Error(container.stderr.read());
  }
}

function createContainer(spec, timeout, resources={}) {
  const { task, version } = spec;
  LOGGER.debug(`Starting container of ${task}:${version}`);
  const container = docker(getImageName(task, version), {}, timeout, resources);

  return container;
}

async function runTask(spec, metadata, timeout, resources) {
  const cgmlstKeys = await getCgmlstKeys(metadata);

  const container = createContainer(spec, timeout, resources);
  const whenOutput = handleContainerOutput(container, spec, metadata);
  const whenExit = handleContainerExit(container, spec, metadata);
  await attachInputStream(container, spec, metadata, cgmlstKeys);

  await whenExit;
  await whenOutput;
}

module.exports = async function handleMessage({ spec, metadata, timeout$: timeout = DEFAULT_TIMEOUT, resources }) {
  const { taskId } = metadata;
  const { task } = spec;
  try {
    await runTask(spec, metadata, timeout, resources);
    return;
  } catch (error) {
    request('clustering', 'send-progress', { taskId, payload: { task, status: 'ERROR' } });
    throw error;
  }
};
