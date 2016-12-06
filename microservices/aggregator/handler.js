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
  CORE_MUTANT_TREE: require('./results/collection-tree'),
  SUBMATRIX: require('./results/subtrees'),
};

function aggregateResult(message) {
  LOGGER.debug(message);

  if (message.taskStatus !== 'SUCCESS' || !(message.taskType in handlers)) {
    return Promise.resolve(); // ignore if not successful, nothing to save
  }

  return handlers[message.taskType](message.taskType, message);
}

module.exports = function (message) {
  return aggregateResult(message).
    then(() => services.request('collection', 'fetch-progress', { uuid: message.collectionId })).
    then(collection =>
      notificationDispatcher.publishNotification(
        message.collectionId, 'progress', collection.toObject()
      )
    );
};
