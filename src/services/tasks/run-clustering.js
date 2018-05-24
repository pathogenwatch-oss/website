/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-params: 0 */
/* eslint max-params: 0 */

const docker = require('docker-run');
const es = require('event-stream');
const BSON = require('bson');

const Genome = require('../../models/genome');
const ClusteringCache = require('../../models/clusteringCache');
const TaskLog = require('../../models/taskLog');

const { getImageName } = require('../../manifest.js');
const { request } = require('../../services');

const LOGGER = require('../../utils/logging').createLogger('runner');
const bson = new BSON();

async function getGenomes(spec, metadata) {
  const { user, sessionID, scheme } = metadata;

  const query = {
    ...Genome.getPrefilterCondition({ user, sessionID }),
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

async function getGenomesInCache(genomes, { version }, { scheme }) {
  const sts = genomes.map(_ => _.analysis.cgmlst.st);

  const projection = { st: 1 };
  for (const st of sts) {
    projection[`alleleDifferences.${st}`] = 1;
  }

  const docs = await ClusteringCache.find(
    { st: { $in: sts }, version, scheme },
    projection
  );

  const cacheBySt = {};
  for (const doc of docs) {
    cacheBySt[doc.st] = doc.alleleDifferences;
  }

  const missingSTs = new Set();
  for (let a = sts.length - 1; a > 0; a--) {
    const stA = sts[a];
    for (let b = 0; b < a; b++) {
      const stB = sts[b];
      if ((cacheBySt[stA] || {})[stB]) continue;
      if ((cacheBySt[stB] || {})[stA]) continue;
      missingSTs.add(stA);
      missingSTs.add(stB);
    }
  }
  return Array.from(missingSTs);
}

function attachInputStream(container, spec, metadata, genomes, uncachedSTs) {
  const { version } = spec;

  const docsStream = Genome.collection.find(
    {
      'analysis.cgmlst.st': { $in: uncachedSTs },
    },
    {
      'analysis.cgmlst': 1,
    },
    {
      raw: true,
    }
  ).stream();
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
  const { scheme, clientId } = metadata;
  let resolve;
  let reject;
  const output = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  request('clustering', 'send-progress', { clientId, payload: { task, status: 'IN PROGRESS' } });
  let lastProgress = 0;
  const results = [];
  const cache = [];
  container.stdout
    .pipe(es.split())
    .on('data', (data) => {
      if (!data) return;
      try {
        const doc = JSON.parse(data);
        if (doc.st && doc.alleleDifferences) {
          const update = {};
          for (const key of Object.keys(doc.alleleDifferences)) {
            update[`alleleDifferences.${key}`] = doc.alleleDifferences[key];
          }
          cache.push({
            updateOne: {
              filter: { st: doc.st, version, scheme },
              update,
              upsert: true,
            },
          });
          if (cache.length > 1000) {
            ClusteringCache.bulkWrite(cache).catch(() => LOGGER.info('Ignoring caching error'));
            cache.splice(0, cache.length);
          }
        } else if (doc.progress) {
          const progress = doc.progress * 0.99;
          if ((progress - lastProgress) >= 1) {
            request('clustering', 'send-progress', { clientId, payload: { task, status: 'IN PROGRESS', progress } });
            lastProgress = progress;
          }
        } else {
          results.push(doc);
        }
      } catch (e) {
        request('clustering', 'send-progress', { clientId, payload: { task, status: 'ERROR' } });
        reject(e);
      }
    })
    .on('end', () => resolve({ results, cache }));
  return output;
}

function handleContainerExit(container, spec, metadata) {
  const { task, version } = spec;
  const { user, sessionID, scheme, clientId } = metadata;
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
    TaskLog.create({ task, version, user, sessionID, scheme, duration, exitCode });

    if (exitCode !== 0) {
      request('clustering', 'send-progress', { clientId, payload: { task, status: 'ERROR' } });
      container.stderr.setEncoding('utf8');
      reject(new Error(container.stderr.read()));
    } else {
      resolve();
    }
  });

  container.on('error', (e) => {
    request('clustering', 'send-progress', { clientId, payload: { task, status: 'ERROR' } });
    reject(e);
  });

  return output;
}

function createContainer(spec) {
  const { task, version, workers } = spec;

  const container = docker(getImageName(task, version), {
    env: {
      WGSA_WORKERS: workers,
    },
  });

  return container;
}

async function runTask(spec, metadata) {
  const genomes = await getGenomes(spec, metadata);
  const uncachedFileIds = await getGenomesInCache(genomes, spec, metadata);

  const container = createContainer(spec, metadata);
  const whenOutput = handleContainerOutput(container, spec, metadata);
  const whenExit = handleContainerExit(container, spec, metadata);
  attachInputStream(container, spec, metadata, genomes, uncachedFileIds);

  await whenExit;
  const { results, cache } = await whenOutput;
  ClusteringCache.bulkWrite(cache).catch(() => LOGGER.info('Ignoring caching error'));
  return results;
}

module.exports = function handleMessage({ spec, metadata }) {
  return runTask(spec, metadata);
};
