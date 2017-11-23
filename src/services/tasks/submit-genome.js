const { enqueue, queues } = require('../taskQueue');

const { getSpeciatorTask } = require('../../manifest');

module.exports = function ({ genomeId, fileId, uploadedAt, clientId }) {
  const speciatorTask = getSpeciatorTask();
  const { task, version } = speciatorTask;
  const metadata = {
    genomeId,
    fileId,
    uploadedAt: new Date(uploadedAt),
    clientId,
  };
  return enqueue(queues.genome, { task, version, metadata });
};
