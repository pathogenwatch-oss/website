const { enqueue } = require('models/queue');
const Genome = require('models/genome');

const LOGGER = require('utils/logging').createLogger('runner');

module.exports = function ({ genomeId, fileId, organismId, speciesId, genusId, tasks, uploadedAt, clientId, userId, precache, priority }) {
  const taskNames = tasks.map((_) => _.task);
  LOGGER.info(`Submitting tasks [${taskNames}] for ${genomeId}`);

  const metadata = {
    genomeId,
    fileId,
    organismId,
    speciesId,
    genusId,
    uploadedAt: new Date(uploadedAt),
    clientId,
    userId,
  };

  return Genome.addPendingTasks(genomeId, taskNames)
    .then(() => Promise.all(
      tasks.map((spec) =>
        enqueue({ spec, metadata, precache, priority } )
      )
    ));
};
