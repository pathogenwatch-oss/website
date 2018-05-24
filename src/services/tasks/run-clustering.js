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
    projection,
    { sort: { st: 1 } }
  );

  const cacheBySt = {};
  for (const doc of docs) {
    cacheBySt[doc.st] = doc.alleleDifferences;
  }

  const missingSTs = new Set();
  for (let i = sts.length - 1; i > 0; i--) {
    if (sts[i] in cacheBySt) {
      for (let j = 0; j < i; j++) {
        if (!(sts[j] in cacheBySt[sts[i]])) {
          missingSTs.add(sts[i]);
          missingSTs.add(sts[j]);
        }
      }
    } else {
      missingSTs.add(sts[i]);
      for (let j = 0; j < i; j++) {
        missingSTs.add(sts[j]);
      }
    }
  }
  return Array.from(missingSTs);
}

function attachInputStream(container, spec, metadata, genomes, uncachedSTs) {
  const { version } = spec;

  const docsStream = Genome.collection.find(
    {
      _id: { $in: genomes.map(_ => _._id) },
      'analysis.cgmlst.st': { $in: uncachedSTs },
    },
    {
      'analysis.cgmlst': 1,
    },
    {
      raw: true,
      sort: { 'analysis.cgmlst.st': 1 },
    }
  );
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
    // .pipe(require('fs').createWriteStream('input.bson'));

  const genomeList = genomes.map(g => ({ _id: g._id, st: g.analysis.cgmlst.st }));
  genomesStream.end(bson.serialize({ genomes: genomeList, thresholds: [ 20, 50, 75, 100, 150, 200 ] }), () => scoresStream.resume());
}

function handleContainerOutput(container, spec, metadata, genomes, resolve, reject) {
  const { task, version } = spec;
  const { scheme, clientId } = metadata;
  request('clustering', 'send-progress', { clientId, payload: { task, status: 'IN PROGRESS' } });
  let lastProgress = 0;
  const results = [];
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
          ClusteringCache.update({ st: doc.st, version, scheme }, update, { upsert: true }).exec();
          if (doc.progress) {
            const progress = doc.progress * 0.99;
            if ((progress - lastProgress) >= 1) {
              request('clustering', 'send-progress', { clientId, payload: { task, progress } });
              lastProgress = progress;
            }
          }
        } else {
          results.push(doc);
        }
      } catch (e) {
        request('clustering', 'send-progress', { clientId, payload: { task, status: 'ERROR' } });
        reject(e);
      }
    })
    .on('end', () => resolve(results));
}

function handleContainerExit(container, spec, metadata, reject) {
  const { task, version } = spec;
  const { user, sessionID, scheme, clientId } = metadata;
  let startTime = process.hrtime();

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
    }
  });

  container.on('error', (e) => {
    request('clustering', 'send-progress', { clientId, payload: { task, status: 'ERROR' } });
    reject(e);
  });
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

  return new Promise((resolve, reject) => {
    const container = createContainer(spec, metadata);

    handleContainerOutput(container, spec, metadata, genomes, resolve, reject);

    handleContainerExit(container, spec, metadata, reject);

    attachInputStream(container, spec, metadata, genomes, uncachedFileIds);
  });
}

module.exports = function handleMessage({ spec, metadata }) {
  return runTask(spec, metadata);
};
