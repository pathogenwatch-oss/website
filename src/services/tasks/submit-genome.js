const LOGGER = require('utils/logging').createLogger('runner');

const getTasksByOrganism = require('manifest.js');
const queue = require('../taskQueue');
const Genome = require('models/genome');

const config = require('configuration');

module.exports = function ({ genomeId, fileId, organismId, clientId }) {
  const tasks = getTasksByOrganism(organismId);

  if (tasks.length === 0) {
    return;
  }

  const taskNames = tasks.map(_ => _.task);
  LOGGER.info(
    `Submitting tasks [${taskNames}] for genome ${genomeId}`
  );

  Genome.addPendingTasks(genomeId, taskNames)
    .then(() => {
      for (const { task, version, retries = config.tasks.retries } of tasks) {
        queue.enqueue(
          queue.queues.tasks, {
            genomeId,
            organismId,
            fileId,
            clientId,
            task,
            version,
            retries,
          }
        );
      }
    });
};
