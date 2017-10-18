const { enqueue } = require('../taskQueue');

const config = require('configuration');
const defaultRetries = config.tasks.retries || 3;
const defaultTimeout = config.tasks.timeout || 30;

module.exports = function ({
  queue,
  genomeId, collectionId, fileId, organismId, speciesId, genusId,
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
