const { enqueue } = require('models/queue');

const { getAssemblyTask } = require('../../manifest');

module.exports = function ({ genomeId, readsKeys, uploadedAt, clientId, userId, queue }) {
  const assemblyTask = getAssemblyTask();
  const metadata = {
    genomeId,
    readsKeys,
    uploadedAt: new Date(uploadedAt),
    clientId,
    userId,
  };
  return enqueue({ spec: assemblyTask, metadata, queue });
};
