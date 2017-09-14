const { request } = require('services/bus');

const { getSpecieatorTask } = require('../../manifest');

module.exports = function ({ genomeId, fileId, uploadedAt, clientId }) {
  const tasks = [ getSpecieatorTask() ];
  return request('tasks', 'enqueue', { genomeId, fileId, uploadedAt, clientId, tasks });
};
