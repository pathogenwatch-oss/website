const { enqueue, queues } = require('../taskQueue');

const { getCollectionTask } = require('../../manifest');

module.exports = function ({ organismId, collectionId, clientId }) {
  const { task, version, requires } = getCollectionTask(organismId, 'tree');
  return enqueue(queues.collection, {
    collectionId,
    clientId,
    task,
    version,
    requires,
    metadata: {
      organismId,
    },
  });
};
