const { enqueue } = require('models/queue');

const { getSpeciatorTask } = require('../../manifest');

module.exports = function ({ genomeId, fileId, uploadedAt, clientId, userId, queue }) {
  const speciatorTask = getSpeciatorTask();
  const metadata = {
    genomeId,
    fileId,
    uploadedAt: new Date(uploadedAt),
    clientId,
    userId,
  };
  return enqueue(speciatorTask, metadata, queue);
};
