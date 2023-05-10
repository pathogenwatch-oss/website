/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint max-params: 0 */

const slug = require('slug');
const { Readable, Writable } = require('stream');
const readline = require('readline');

const store = require('utils/object-store');
const Genome = require('models/genome');
const CgmlstProfile = require('models/cgmlstprofile');
const TaskLog = require('models/taskLog');
const docker = require('services/docker');

const { getImageName } = require('manifest.js');
const { request } = require('services');

const config = require('configuration');
const LOGGER = require('utils/logging').createLogger('runner');

const DEFAULT_THRESHOLD = 50;

function buildQuery({ userId, scheme, organismId }) {
  return {
    ...Genome.getPrefilterCondition({ user: userId ? { _id: userId } : null }),
    'analysis.cgmlst.scheme': scheme,
    'analysis.speciator.organismId': organismId,
  };
}

async function extractCgstSet(metadata) {
  const cgSTs = {};
  for await (const doc of Genome.find(buildQuery(metadata), {
    'analysis.cgmlst.st': 1,
    fileId: 1,
  }).lean().cursor()) {
    // Pick a random unique document for each ST to emulate what the code did previously.
    cgSTs[doc.analysis.cgmlst.st] = doc.fileId;
  }
  return cgSTs;
}

function determineMaxThreshold(scheme) {
  if (!('maxClusteringThreshold' in config)) return DEFAULT_THRESHOLD;
  const maxClusteringThreshold = config.maxClusteringThreshold;
  return scheme in maxClusteringThreshold ? maxClusteringThreshold[scheme] : maxClusteringThreshold.default;
}

function attachInputStream(container, spec, metadata) {
  const { userId = 'public', scheme, organismId } = metadata;
  const { version } = spec;

  async function* generateInput() {
    // Two queries are required to get the information in the order required by the clustering program while also being
    // fairly memory efficient. The reduction to a single profile per ST is not essential but for Klebsiella it does
    // remove a lot of redundancy.
    const cgSTs = await extractCgstSet(metadata);
    const maxThreshold = determineMaxThreshold(scheme);
    yield JSON.stringify({
      STs: Object.keys(cgSTs),
      Threshold: maxThreshold,
    });

    const clustering = await request('clustering', 'cluster-details', { scheme, version, userId, organismId });
    if (clustering !== undefined && clustering !== null) {
      yield JSON.stringify(clustering);

    } else {
      yield JSON.stringify({
        edges: {},
        threshold: maxThreshold,
        pi: [],
        lambda: [],
        STs: [],
      });
    }

    const query = { fileId: { $in: Object.values(cgSTs) } };

    for await (const { st, matches, schemeSize } of CgmlstProfile.find(query, { _id: 0, fileId: 0 }).lean().cursor()) {
      yield JSON.stringify({ ST: st, Matches: matches, schemeSize });
    }
  }

  const inputStream = Readable.from(generateInput());
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
            await request('clustering', 'send-progress', {
              taskId,
              payload: { task, status: 'IN PROGRESS', message: doc.message, progress },
            });
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
  await container.wait({ condition: 'next-exit' });
  return results;
}

async function uploadResults(results, spec, metadata) {
  const { version } = spec;
  const { userId, scheme, organismId } = metadata;
  const fullVersion = `${version}-${slug(scheme, { lower: true })}`;
  await store.putAnalysis('cgmlst-clustering', fullVersion, userId ? userId.toString() : 'public', organismId, results);
}

async function handleContainerExit(container, spec, metadata, inputStream) {
  const { task, version, resources } = spec;
  const { userId, scheme, taskId } = metadata;

  await container.start();
  inputStream(container, spec, metadata);

  const startTime = process.hrtime();
  LOGGER.info('spawn', container.id, 'running task', task);

  const { StatusCode: statusCode } = await container.wait({ condition: 'next-exit' });

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
  // Using a pre-query to get the STs and then streaming the actual records to the container directly.

  const container = await createContainer(spec, timeout, resources);
  const whenResults = handleContainerOutput(container, spec, metadata);
  const statusCode = await handleContainerExit(container, spec, metadata, attachInputStream);

  const results = await whenResults;
  if (container.timeout) throw new Error('timeout');
  else if (statusCode === 137) throw new Error('killed');
  await uploadResults(results, spec, metadata);
  return statusCode;
}

module.exports = async function handleMessage({ spec, metadata }) {
  const { taskId } = metadata;
  const { task, timeout, resources = {} } = spec;
  try {
    const statusCode = await runTask(spec, metadata, timeout, resources);
    return { statusCode };
  } catch (error) {
    request('clustering', 'send-progress', { taskId, payload: { task, status: 'ERROR' } });
    throw error;
  }
};
