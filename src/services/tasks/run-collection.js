/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-params: 0 */

const docker = require('docker-run');
const es = require('event-stream');

const Collection = require('../../models/collection');
const Genome = require('../../models/genome');
const ScoreCache = require('../../models/scoreCache');

const { getImageName } = require('manifest.js');

const LOGGER = require('utils/logging').createLogger('runner');

function getGenomes(collectionId, subtree) {
  return Collection.findOne(
    { _id: collectionId },
    { genomes: 1 },
  )
  .lean()
  .then(({ genomes }) => {
    const query =
      subtree ? {
        'analysis.core.fp.reference': subtree,
        $or: [ { _id: { $in: genomes } }, { population: true } ],
      } : {
        _id: { $in: genomes },
      };
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

function runTask(task, version, requires, workers = 2, collectionId, metadata) {
  const { subtree, organismId } = metadata;
  return getGenomes(collectionId, subtree)
    .then(genomes => new Promise((resolve, reject) => {
      const container = docker(getImageName(task, version), {
        env: {
          WGSA_ORGANISM_TAXID: organismId,
          WGSA_COLLECTION_ID: collectionId,
          WGSA_WORKERS: workers,
        },
        remove: false,
      });

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
            } else {
              const populationIds = [];
              if (subtree) {
                for (const { _id, population } of genomes) {
                  if (population) {
                    populationIds.push(_id);
                  }
                }
              }
              resolve(Object.assign(doc, {
                size: genomes.length,
                populationIds,
              }));
            }
          } catch (e) {
            reject(e);
          }
        });

      scoresStream.on('end', () => genomesStream.resume());

      es.merge(
        scoresStream,
        genomesStream
      )
      .pipe(container.stdin);
      // .pipe(require('fs').createWriteStream('input.bson'));

      container.on('exit', (exitCode) => {
        LOGGER.info('exit', exitCode);
        if (exitCode !== 0) {
          container.stderr.setEncoding('utf8');
          reject(new Error(container.stderr.read()));
        }
      });
      container.on('spawn', (containerId) => {
        LOGGER.info('spawn', containerId, 'running task', task, 'for collection', collectionId);
      });
      container.on('error', reject);
    }));
}

module.exports = function handleMessage({ task, version, requires, workers, collectionId, metadata }) {
  return runTask(task, version, requires, workers, collectionId, metadata);
};
