const notificationDispatcher = require('services/notificationDispatcher');

const LOGGER = require('utils/logging').createLogger('aggregator service');

const services = require('services');

const handlers = {
  MLST: require('./results/mlst'),
  PAARSNP: require('./results/paarsnp'),
  CORE: require('./results/core'),
  FP: require('./results/fp'),
  NGMAST: require('./results/ngmast'),
  GENOTYPHI: require('./results/genotyphi'),
  // CORE_MUTANT_TREE: () => Promise.resolve(),
  // SUBMATRIX: () => Promise.resolve(),
};

function aggregateResult(message) {
  LOGGER.debug(message);

  if (message.taskStatus !== 'SUCCESS' || !(message.taskType in handlers)) {
    return Promise.resolve(); // ignore if not successful, nothing to save
  }

  return handlers[message.taskType](message);
}

module.exports = function (message) {
  return aggregateResult(message).
    then(() => services.request('collection', 'record-progress', message)).
    then(collection =>
      notificationDispatcher.publishNotification(collection.uuid, 'progress', {
        collectionId: collection.uuid,
        size: collection.size,
        status: collection.status,
        progress: collection.progress,
      })
    );
};
