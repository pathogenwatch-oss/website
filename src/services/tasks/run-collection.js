/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-params: 0 */
/* eslint max-params: 0 */

const docker = require('docker-run');
const es = require('event-stream');

const Collection = require('../../models/collection');
const Genome = require('../../models/genome');
const ScoreCache = require('../../models/scoreCache');
const TaskLog = require('../../models/taskLog');

const { getImageName } = require('../../manifest.js');
const { request } = require('../../services');

const LOGGER = require('../../utils/logging').createLogger('runner');

function getGenomes(spec, metadata) {
  const { task } = spec;
  const { collectionId, name } = metadata;
  return Collection.findOne(
    { _id: collectionId },
    { genomes: 1 },
  )
  .lean()
  .then(({ genomes }) => {
    let query = { _id: { $in: genomes } };
    if (task === 'subtree') {
      query = {
        'analysis.core.fp.reference': name,
        $or: [ { _id: { $in: genomes } }, { population: true } ],
      };
    }
    return Genome
      .find(query, { fileId: 1 }, { sort: { fileId: 1 } })
      .lean()
      .then(docs => docs.map(doc => {
        const ids = new Set(genomes.map(_ => _.toString()));
        doc.population = !ids.has(doc._id.toString());
        return doc;
      }));
  });
}

function getGenomesInCache(genomes) {
  return ScoreCache.find(
    { fileId: { $in: genomes.map(_ => _.fileId) } },
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

function getInputStream(spec, genomes) {
  const { requires } = spec;

  const scoresStream = ScoreCache.collection.find(
    { fileId: { $in: genomes.map(_ => _.fileId) } },
    genomes.reduce((projection, { fileId }) => {
      projection[`scores.${fileId}`] = 1;
      return projection;
    }, { fileId: 1 }),
    { raw: true, sort: { fileId: 1 } }
  );
  scoresStream.pause();

  const genomesStream = Genome.collection.find(
    { _id: { $in: genomes.map(_ => _._id) } },
    requires.reduce((memo, required) => {
      const projection = required.field ?
        `analysis.${required.task}.${required.field}` :
        `analysis.${required.task}`;
      memo[projection] = 1;
      return memo;
    }, { fileId: 1 }),
    { raw: true, sort: { fileId: 1 } }
  );
  genomesStream.pause();

  scoresStream.on('end', () => genomesStream.resume());

  return es.merge(
    scoresStream,
    genomesStream
  );
}

function handleContainerOutput(container, spec, metadata, genomes, resolve, reject) {
  const { task, version } = spec;
  const { clientId } = metadata;
  let progress = 0;
  container.stdout
    .pipe(es.split())
    .on('data', (data) => {
      try {
        const doc = JSON.parse(data);
        if (doc.fileId && doc.scores) {
          const update = {};
          for (const key of Object.keys(doc.scores)) {
            update[`scores.${key}`] = doc.scores[key];
          }
          ScoreCache.update({ fileId: doc.fileId, version }, update, { upsert: true }).exec();
          if (doc.progress > progress) {
            progress = doc.progress * 0.99;
            request('collection', 'send-progress', { clientId, task, progress });
          }
        } else {
          const populationIds = [];
          if (task === 'subtree') {
            for (const { _id, population } of genomes) {
              if (population) {
                populationIds.push(_id);
              }
            }
          }
          const { newick } = doc;
          resolve({
            newick,
            populationIds,
            name: metadata.name,
            size: genomes.length,
          });
        }
      } catch (e) {
        reject(e);
      }
    });
}

function handleContainerExit(container, spec, metadata, reject) {
  const { task, version } = spec;
  const { organismId, collectionId } = metadata;
  let startTime = process.hrtime();

  container.on('spawn', (containerId) => {
    startTime = process.hrtime();
    LOGGER.info('spawn', containerId, 'running task', task, 'for collection', collectionId);
  });

  container.on('exit', (exitCode) => {
    LOGGER.info('exit', exitCode);

    const [ durationS, durationNs ] = process.hrtime(startTime);
    const duration = Math.round(durationS * 1000 + durationNs / 1e6);
    TaskLog.create({ collectionId, task, version, organismId, duration, exitCode });

    if (exitCode !== 0) {
      container.stderr.setEncoding('utf8');
      reject(new Error(container.stderr.read()));
    }
  });

  container.on('error', reject);
}

function createContainer(spec, metadata) {
  const { task, version, workers } = spec;
  const { organismId, collectionId } = metadata;

  const container = docker(getImageName(task, version), {
    env: {
      WGSA_ORGANISM_TAXID: organismId,
      WGSA_COLLECTION_ID: collectionId,
      WGSA_WORKERS: workers,
    },
    remove: false,
  });

  return container;
}

function runTask(spec, metadata) {
  return getGenomes(spec, metadata)
    .then(genomes => new Promise((resolve, reject) => {
      const container = createContainer(spec, metadata);

      handleContainerOutput(container, spec, metadata, genomes, resolve, reject);

      handleContainerExit(container, spec, metadata, reject);

      getInputStream(spec, genomes).pipe(container.stdin);
        // .pipe(require('fs').createWriteStream('tree-input.bson'));
    }));
}

module.exports = function handleMessage({ spec, metadata }) {
  return runTask(spec, metadata);
};
