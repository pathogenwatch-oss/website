const { enqueue, queues } = require('../taskQueue');

const config = require('configuration');
const defaultRetries = config.tasks.retries || 3;
const defaultTimeout = config.tasks.timeout || 30;

module.exports = function ({
  genomeId, collectionId, fileId, organismId, speciesId, genusId,
  queue = organismId ? queues.tasks : queues.speciator,
  uploadedAt, clientId,
  task, version, retries = defaultRetries, timeout = defaultTimeout,
}) {
  return enqueue(
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
  );
};
