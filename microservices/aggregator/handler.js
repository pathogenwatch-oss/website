const notificationDispatcher = require('services/notificationDispatcher');

const LOGGER = require('utils/logging').createLogger('aggregator service');

const services = require('services');

const handlers = {
  MLST: message => {},
  PAARSNP: message => {},
  CORE: message => {},
  FP: message => {},
  GSL: message => {},
  PHYLO_MATRIX: message => {},
  CORE_MUTANT_TREE: message => {},
  SUBMATRIX: message => {},
};

function aggregateResult(message) {
  LOGGER.debug(message);

  if (message.taskStatus !== 'SUCCESS') {
    return Promise.resolve(); // ignore if not successful
  }

  return handlers[message.taskType](message);
}

module.exports = function (message) {
  aggregateResult(message).
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
