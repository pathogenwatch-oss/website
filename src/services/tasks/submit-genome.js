const LOGGER = require('utils/logging').createLogger('runner');

const { request } = require('services/bus');

const { getTasksByOrganism } = require('manifest.js');
const Genome = require('models/genome');

module.exports = function ({ genomeId, collectionId, fileId, organismId, speciesId, genusId, uploadedAt, clientId }) {
  const tasks = getTasksByOrganism(organismId, speciesId, genusId, collectionId);

  if (tasks.length === 0) {
    return Promise.resolve();
  }

  const taskNames = tasks.map(_ => _.task);
  const type = collectionId ? 'collectiongenome' : 'genome';
  LOGGER.info(`Submitting tasks [${taskNames}] for ${type} ${genomeId}`);

  return (
    (collectionId ? Promise.resolve() : Genome.addPendingTasks(genomeId, taskNames))
    .then(() => {
      const promises = tasks.map(({ task, version, retries, timeout }) =>
        request('tasks', 'cached', { fileId, task, version })
          .then(result => {
            if (result) {
              return request('genome', 'add-analysis', {
                genomeId,
                collectionId,
                uploadedAt,
                task,
                version,
                result,
                clientId,
              });
            }
            return request('tasks', 'enqueue', {
              genomeId,
              collectionId,
              fileId,
              organismId,
              speciesId,
              genusId,
              uploadedAt,
              clientId,
              task,
              version,
              retries,
              timeout,
            });
          })
      );
      return Promise.all(promises);
    })
  );
};
