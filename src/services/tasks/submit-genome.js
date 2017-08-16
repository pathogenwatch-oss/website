const LOGGER = require('utils/logging').createLogger('runner');

const { request } = require('services/bus');

const { getTasksByOrganism } = require('manifest.js');
const Genome = require('models/genome');

module.exports = function ({ genomeId, fileId, organismId, clientId }) {
  const tasks = getTasksByOrganism(organismId);

  if (tasks.length === 0) {
    return;
  }

  const taskNames = tasks.map(_ => _.task);
  LOGGER.info(`Submitting tasks [${taskNames}] for genome ${genomeId}`);

  Genome.addPendingTasks(genomeId, taskNames)
    .then(() => {
      request('tasks', 'enqueue', { genomeId, fileId, organismId, clientId, tasks });
    });
};
