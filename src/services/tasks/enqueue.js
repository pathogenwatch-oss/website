const { enqueue, queues } = require('../taskQueue');

const config = require('configuration');
const defaultRetries = config.tasks.retries || 3;
const defaultTimeout = config.tasks.timeout || 30;

module.exports = function ({ genomeId, collectionId, fileId, organismId, speciesId, genusId, uploadedAt, clientId, tasks }) {
  const name = organismId ? queues.tasks : queues.speciator;
  const promises = tasks.map(({ task, version, retries = defaultRetries, timeout = defaultTimeout }) =>
    enqueue(
      name, {
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
        retries,
        timeout,
      }
    )
  );
  return Promise.all(promises);
};
