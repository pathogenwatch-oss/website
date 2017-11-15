const CollectionGenome = require('models/collectionGenome');

const { enqueue, queues } = require('../taskQueue');

const { getTreesTask } = require('../../manifest');

function getSubtypes(_collection) {
  return CollectionGenome.distinct('analysis.core.fp', { _collection });
}

module.exports = function ({ collectionId, clientId }) {
  return getSubtypes(collectionId)
    .then(subtypes => {
      console.log({ subtypes });
      const { task, version, requires } = getTreesTask();
      return Promise.all(
        subtypes.map(subtype => enqueue(queues.trees, {
          collectionId,
          clientId,
          task: 'subtree',
          version,
          requires,
          subtype,
        }))
      );
    });
};
