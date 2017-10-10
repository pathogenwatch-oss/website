const services = require('services');

const handlers = {
  CORE: require('./results/core'),
  FP: require('./results/fp'),
  CORE_MUTANT_TREE: require('./results/collection-tree'),
  SUBMATRIX: require('./results/subtrees'),
};

function aggregateResult(message) {
  if (!(message.taskType in handlers)) {
    return Promise.resolve(); // ignore, nothing to save
  }

  if (message.taskStatus !== 'SUCCESS') {
    return services.request('collection', 'progress-error', message);
  }

  return handlers[message.taskType](message.taskType, message);
}

module.exports = function (message) {
  if (message.action !== 'CREATE') return Promise.resolve();
  const { collectionId } = message;
  return aggregateResult(message)
    .then(() =>
      services.request('collection', 'send-progress', { collectionId })
    );
};
