const { request } = require('services');
const { getSpeciatorTask } = require('../../manifest');

module.exports = function ({ genomeId, fileId, uploadedAt, clientId }) {
  const { task, version } = getSpeciatorTask();
  return request('tasks', 'enqueue', {
    genomeId,
    fileId,
    uploadedAt,
    clientId,
    task,
    version,
  });
};
