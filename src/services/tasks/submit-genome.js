const mapLimit = require('promise-map-limit');

const { request } = require('services/bus');

const { getTasksByOrganism } = require('manifest.js');

const LOGGER = require('utils/logging').createLogger('runner');

module.exports = function ({ genomeId, collectionId, fileId, organismId, speciesId, genusId, uploadedAt, clientId }) {
  const tasks = getTasksByOrganism(organismId, speciesId, genusId, collectionId);

  if (tasks.length === 0) {
    return Promise.resolve();
  }

  const taskNames = tasks.map(_ => _.task);
  const type = collectionId ? 'collectiongenome' : 'genome';
  LOGGER.info(`Submitting tasks [${taskNames}] for ${type} ${genomeId}`);

  return mapLimit(tasks, 1, ({ task, version, retries, timeout }) =>
    request('tasks', 'enqueue', {
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
    })
  );
};
