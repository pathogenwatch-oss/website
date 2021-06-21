const { enqueue, taskTypes } = require('models/queue');

const { getCollectionTask } = require('../../manifest');

module.exports = function ({ organismId, collectionId, clientId }) {
  const spec = getCollectionTask(organismId, 'tree');
  return enqueue(
    spec,
    {
      organismId,
      collectionId,
      clientId,
      name: 'collection',
    },
  );
};
