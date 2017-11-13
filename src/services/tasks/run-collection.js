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
  return CollectionGenome.find({ _collection: collectionId }, { fileId: 1 }).lean()
    .then(fileIds => new Promise((resolve, reject) => {
      const fileIdByGenomeId = fileIds.reduce((memo, doc) => {
        memo[doc._id] = doc.fileId;
        return memo;
      }, {});
      const container = docker(getImageName(task, version), {
        env: {
          WGSA_ORGANISM_TAXID: organismId,
          WGSA_COLLECTION_ID: collectionId,
        },
        remove: false,
      });
      const stream = CollectionGenome.collection.find(
        { _collection: collectionId },
        requires.reduce((projection, requiredTask) => {
          projection[`analysis.${requiredTask}`] = 1;
          return projection;
        }, { fileId: 1 }),
        { raw: true }
      );
      stream.pipe(container.stdin);

      container.stdout
        .pipe(es.split())
        .on('data', (data) => {
          try {
            const doc = JSON.parse(data);
            if (doc.id && doc.scores) {
              const update = {};
              for (const key of Object.keys(doc.scores)) {
                update[`scores.${fileIdByGenomeId[key]}`] = doc.scores[key];
              }
              console.log({ fileId: fileIdByGenomeId[doc.id], version }, update);
              ScoreCache.update({ fileId: fileIdByGenomeId[doc.id], version }, update, { upsert: true })
                .then(updated => console.log({ updated }));
            } else {
              resolve(doc);
            }
          } catch (e) {
            reject(e);
          }
        });

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
