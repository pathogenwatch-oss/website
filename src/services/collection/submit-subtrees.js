const Collection = require('models/collection');

const { enqueue, taskTypes } = require('models/queue');

const { getCollectionTask } = require('manifest');

function getSubtrees(collectionId) {
  return Collection.findOne({ _id: collectionId }, { 'subtrees.name': 1 })
    .lean()
    .then(({ subtrees }) => subtrees);
}

module.exports = function ({ organismId, collectionId, clientId }) {
  const spec = getCollectionTask(organismId, 'subtree');
  if (!spec) return Promise.resolve();
  return getSubtrees(collectionId)
    .then(subtrees => Promise.all(
      subtrees.map(({ name }) =>
        enqueue(spec, { organismId, collectionId, name, clientId })
      )
    ));
};
