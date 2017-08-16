const { enqueue, queues } = require('../taskQueue');

const config = require('configuration');
const defaultRetries = config.tasks.retries || 3;

module.exports = function ({ genomeId, fileId, organismId, clientId, tasks }) {
  const name = organismId ? queues.tasks : queues.specieator;
  const promises = tasks.map(({ task, version, retries = defaultRetries }) =>
    enqueue(
      name, { genomeId, fileId, organismId, clientId, task, version, retries }
    )
  );
  return Promise.all(promises);
};
