/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-params: 0 */

const docker = require('docker-run');
const crypto = require('crypto');
const es = require('event-stream');

const Analysis = require('models/analysis');
const CollectionGenome = require('../../models/collectionGenome');
const ScoreCache = require('../../models/scoreCache');

const { getImageName } = require('manifest.js');

const LOGGER = require('utils/logging').createLogger('runner');

function runTask(task, version, collectionId, requires, organismId) {
  return CollectionGenome.find({ _collection: collectionId }, { fileId: 1 }, { sort: { fileId: 1 } }).lean()
    .then(fileIds => new Promise((resolve, reject) => {
      const container = docker(getImageName(task, version), {
        env: {
          WGSA_ORGANISM_TAXID: organismId,
          WGSA_COLLECTION_ID: collectionId,
        },
        remove: false,
      });

      const scoresStream = ScoreCache.collection.find(
        { fileId: { $in: fileIds.map(_ => _.fileId) } },
        fileIds.reduce((projection, { fileId }) => {
          projection[`scores.${fileId}`] = 1;
          return projection;
        }, { fileId: 1 }),
        { raw: true, sort: { fileId: 1 } }
      );

      const genomesStream = CollectionGenome.collection.find(
        { _collection: collectionId },
        requires.reduce((projection, requiredTask) => {
          projection[`analysis.${requiredTask}`] = 1;
          return projection;
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
              resolve(doc);
            }
          } catch (e) {
            reject(e);
          }
        });

      es.merge(
        scoresStream,
        genomesStream
      )
      .pipe(container.stdin);
      // .pipe(require('fs').createWriteStream('input.bson'));

      scoresStream.on('end', () => genomesStream.resume());

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

module.exports = function handleMessage({ collectionId, task, version, requires, organismId }) {
  return CollectionGenome.find({ _collection: collectionId }, { fileId: 1 }, { sort: { fileId: 1 } })
    .then(results => {
      const hash = crypto.createHash('sha1');
      for (const { fileId } of results) {
        hash.update(fileId);
      }
      return hash.digest('hex');
    })
    .then(fileId =>
      Analysis.findOne({ fileId, task, version })
        .then(model => {
          if (model) return model.results;
          return (
            runTask(task, version, collectionId, requires, organismId)
              .then(results => {
                // Analysis.create({ fileId, task, version, results });
                return results;
              })
          );
        })
    );
};
