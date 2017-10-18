const { request } = require('services');
const { queues } = require('../taskQueue');

module.exports = function ({ genomeId, collectionId, fileId, organismId, speciesId, genusId, uploadedAt, clientId, tasks }) {
  const queue = organismId ? queues.cache : queues.speciator;
  const promises = tasks.map(({ task, version, retries, timeout }) =>
    request('tasks', 'enqueue-one', {
      queue,
      genomeId,
      collectionId,
      fileId,
      organismId,
      speciesId,
      genusId,
      uploadedAt,
      clientId,
      task,
      version,
      retries,
      timeout,
    })
  );
  return Promise.all(promises);
};
