const { enqueue, queues } = require('../taskQueue');

const { request } = require('services');
const Genome = require('models/genome');

function addPendingTask(collectionId, genomeId, task) {
  if (collectionId) return Promise.resolve();
  return Genome.addPendingTask(genomeId, task);
}

module.exports = function ({
  genomeId, collectionId, fileId, organismId, speciesId, genusId,
  queue = organismId ? queues.tasks : queues.speciator,
  uploadedAt, clientId,
  task, version, retries, timeout,
}) {
  request('tasks', 'find', { fileId, task, version })
    .then(result => {
      if (result) {
        return request('genome', 'add-analysis', {
          genomeId,
          fileId,
          collectionId,
          uploadedAt: new Date(uploadedAt),
          task,
          version,
          result,
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
