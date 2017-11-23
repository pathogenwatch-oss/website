const { enqueue, queues } = require('../taskQueue');
const Genome = require('../../models/genome');

const LOGGER = require('../../utils/logging').createLogger('runner');

module.exports = function ({ genomeId, fileId, organismId, speciesId, genusId, tasks, uploadedAt, clientId }) {
  const taskNames = tasks.map(_ => _.task);
  LOGGER.info(`Submitting tasks [${taskNames}] for ${genomeId}`);

  const metadata = {
    genomeId,
    fileId,
    organismId,
    speciesId,
    genusId,
    uploadedAt: new Date(uploadedAt),
    clientId,
  };

  return Genome.addPendingTasks(genomeId, taskNames)
    .then(() => Promise.all(
      tasks.map(({ task, version, retries, timeout }) =>
        enqueue(
          task in queues ? task : queues.tasks,
          { task, version, retries, timeout, metadata }
        )
      )
    ));
};
