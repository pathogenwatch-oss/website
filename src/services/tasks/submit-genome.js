const LOGGER = require('utils/logging').createLogger('runner');

const getTasksByOrganism = require('manifest.js');
const queue = require('../taskQueue');

const Genome = require('models/genome');

const config = require('configuration');

module.exports = function ({ genomeId, fileId, organismId, clientId }) {
  const tasks = getTasksByOrganism(organismId);

  LOGGER.info(
    `Submitting tasks [${tasks.map(_ => _.task)}] for genome ${genomeId}`
  );

  return (
    Genome.initialiseAnalysis(genomeId, tasks)
      .then(analysis => {
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
        return analysis;
      })
  );
};
