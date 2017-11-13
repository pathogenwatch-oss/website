/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-params: 0 */

const docker = require('docker-run');
const crypto = require('crypto');

const Analysis = require('models/analysis');
const CollectionGenome = require('../../models/collectionGenome');

const { getImageName } = require('manifest.js');

const LOGGER = require('utils/logging').createLogger('runner');

function runTask(task, version, collectionId, requires, organismId) {
  return new Promise((resolve, reject) => {
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
      }, {}),
      { raw: true }
    );
    stream.pipe(container.stdin);
    const buffer = [];
    container.stdout.on('data', (data) => {
      buffer.push(data.toString());
    });
    container.on('exit', (exitCode) => {
      LOGGER.info('exit', exitCode);
      if (exitCode !== 0) {
        container.stderr.setEncoding('utf8');
        reject(new Error(container.stderr.read()));
      } else if (buffer.length === 0) {
        reject(new Error('No output received.'));
      } else {
        let output;
        try {
          output = JSON.parse(buffer.join(''));
        } catch (e) {
          reject(e);
        }
        resolve(output);
      }
    });
    container.on('spawn', (containerId) => {
      LOGGER.info('spawn', containerId, 'running task', task, 'for collection', collectionId);
    });
    container.on('error', reject);
  });
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
