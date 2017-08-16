const { request } = require('services/bus');

const { getSpecieatorTask } = require('../../manifest');

module.exports = function ({ genomeId, fileId, clientId }) {
  const tasks = [ getSpecieatorTask() ];
  return request('tasks', 'enqueue', { genomeId, fileId, clientId, tasks });
};
