const queue = require('../taskQueue');

const DEFAULT_TASKS_CONFIG = {
  specieator: { version: 1 },
  retries: 3,
};
const { tasks = DEFAULT_TASKS_CONFIG } = require('configuration');
const { retries } = tasks;
const { version } = tasks.specieator;
const task = 'specieator';

module.exports = function ({ genomeId, fileId, clientId }) {
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
