const { enqueue } = require('models/queue');

const { getCollectionTask } = require('../../manifest');

module.exports = function ({ organismId, collectionId, clientId, priority = 0 }) {
  const spec = getCollectionTask(organismId, 'tree');
  return enqueue(
    {
      spec,
      metadata: {
        organismId,
        collectionId,
        clientId,
        name: 'collection',
      },
      priority,
    });
};
