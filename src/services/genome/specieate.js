const queue = require('../taskQueue');
const { getSpecieatorTask } = require('../../manifest');
const { tasks } = require('../../configuration');
const { retries = 3 } = tasks;

module.exports = function ({ genomeId, fileId, clientId }) {
  const { task, version } = getSpecieatorTask();
  queue.enqueue(
    queue.queues.specieator, {
      genomeId,
      fileId,
      clientId,
      task,
      version,
      retries,
    }
  );
};
