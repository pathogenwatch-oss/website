const LOGGER = require('utils/logging').createLogger('runner');

const getTasksByOrganism = require('manifest.js');
const queue = require('../taskQueue');

const config = require('configuration');

module.exports = function ({ genomeId, fileId, organismId, clientId }) {
  const tasks = getTasksByOrganism(organismId);

  LOGGER.info(
    `Submitting tasks [${tasks.map(_ => _.task)}] for genome ${genomeId}`
  );

  for (const { task, version, retries = config.tasks.retries } of tasks) {
    queue.enqueue({
      genomeId,
      organismId,
      fileId,
      clientId,
      task,
      version,
      retries,
    });
  }
};
