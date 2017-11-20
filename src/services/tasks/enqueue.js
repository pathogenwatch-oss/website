const { enqueue, queues } = require('../taskQueue');

const { request } = require('services');
const Genome = require('models/genome');

const config = require('configuration');
const defaultRetries = config.tasks.retries || 3;
const defaultTimeout = config.tasks.timeout || 30;

function addPendingTask(collectionId, genomeId, task) {
  if (collectionId) return Promise.resolve();
  return Genome.addPendingTask(genomeId, task);
}

module.exports = function ({
  genomeId, collectionId, fileId, organismId, speciesId, genusId,
  queue = organismId ? queues.tasks : queues.speciator,
  uploadedAt, clientId,
  task, version, retries = defaultRetries, timeout = defaultTimeout,
}) {
  return request('tasks', 'exists', { fileId, task, version })
    .then(exists => {
      if (exists) {
        return request('genome', 'add-analysis', {
          genomeId,
          fileId,
          collectionId,
          uploadedAt: new Date(uploadedAt),
          task,
          version,
          clientId,
        });
      }
      return addPendingTask(collectionId, genomeId, task)
        .then(() => enqueue(
          queue, {
            genomeId,
            collectionId,
            fileId,
            organismId,
            speciesId,
            genusId,
            uploadedAt: new Date(uploadedAt),
            clientId,
            task,
            version,
            timeout,
            retries,
          }
        ));
    });
};
