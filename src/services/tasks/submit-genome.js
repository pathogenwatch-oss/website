const { enqueue, queues } = require('../taskQueue');

const { getSpeciatorTask } = require('../../manifest');

module.exports = function ({ genomeId, fileId, uploadedAt, clientId, userId, queue = queues.genome }) {
  const speciatorTask = getSpeciatorTask();
  const { task, version } = speciatorTask;
  const metadata = {
    genomeId,
    fileId,
    uploadedAt: new Date(uploadedAt),
    clientId,
    userId,
  };
  return enqueue(queue, { task, version, metadata }, queues.genome);
};
