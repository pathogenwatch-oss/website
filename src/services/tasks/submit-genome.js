const LOGGER = require('utils/logging').createLogger('runner');

const { request } = require('services/bus');

const { getTasksByOrganism } = require('manifest.js');
const Genome = require('models/genome');

module.exports = function ({ genomeId, collectionId, fileId, organismId, speciesId, genusId, uploadedAt, clientId }) {
  const tasks = getTasksByOrganism(organismId, speciesId, genusId, collectionId);

  if (tasks.length === 0) {
    return;
  }

  const taskNames = tasks.map(_ => _.task);
  const type = collectionId ? 'collectiongenome' : 'genome';
  LOGGER.info(`Submitting tasks [${taskNames}] for ${type} ${genomeId}`);

  (collectionId ?
    Promise.resolve() :
    Genome.addPendingTasks(genomeId, taskNames))
    .then(() => {
      request('tasks', 'enqueue', { genomeId, collectionId, fileId, organismId, speciesId, genusId, uploadedAt, clientId, tasks });
    });
};
