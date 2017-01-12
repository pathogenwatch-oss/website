const notificationDispatcher = require('services/notificationDispatcher');

const services = require('services');
const { isReference } = require('./utils');

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
  if (!(message.taskType in handlers) || message.action !== 'CREATE') {
    return Promise.resolve(); // ignore, nothing to save
  }

  if (message.taskStatus !== 'SUCCESS') {
    return services.request('collection', 'progress-error', message);
  }

  return handlers[message.taskType](message.taskType, message);
}

module.exports = function (message) {
  return aggregateResult(message).
    then(() =>
      (isReference(message) ?
        Promise.resolve() :
        services.request('collection', 'fetch-progress', { uuid: message.collectionId }).
          then(collection => {
            if (collection.reference) return;

            const { status, progress } = collection.toObject();
            notificationDispatcher.publishNotification(
              message.collectionId, 'progress', { status, progress }
            );
          })
      )
    );
};
