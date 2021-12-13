const Queue = require('models/queue');
const Genome = require('models/genome');

const LOGGER = require('utils/logging').createLogger('runner');

module.exports = function (
  {
    genomeId,
    fileId,
    organismId,
    speciesId,
    genusId,
    tasks,
    uploadedAt,
    clientId,
    userId,
    precache,
  }
) {
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

  Queue
    .determinePriority({ spec: { taskType: 'task' }, metadata: { userId } })
    .then(priority => {
      let overridePriority = priority;
      return Genome.addPendingTasks(genomeId, taskNames)
        .then(() => Promise.all(
          tasks.map((spec) => {
            overridePriority -= 1;
            return Queue.enqueue(
              { spec, metadata, precache, overridePriority });
          })
        ));
    });
};
