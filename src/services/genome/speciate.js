const { request } = require('services/bus');

const { getSpeciatorTask } = require('../../manifest');

module.exports = function ({ genomeId, fileId, uploadedAt, clientId }) {
  const tasks = [ getSpeciatorTask() ];
  return request('tasks', 'enqueue', { genomeId, fileId, uploadedAt, clientId, tasks });
};
