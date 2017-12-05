const { enqueue, queues } = require('../taskQueue');

const { getCollectionTask } = require('../../manifest');

module.exports = function ({ organismId, collectionId, clientId }) {
  const spec = getCollectionTask(organismId, 'tree');
  return enqueue(queues.collection, {
    spec,
    metadata: {
      organismId,
      collectionId,
      clientId,
      name: 'collection',
    },
  });
};
