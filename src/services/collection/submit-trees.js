const Collection = require('models/collection');

const { enqueue } = require('models/queue');

const { getCollectionTask } = require('manifest');
const User = require('models/user');

function getSubtrees(collectionId) {
  return Collection.findOne({ _id: collectionId }, { 'subtrees.name': 1 })
    .lean()
    .then(({ subtrees }) => subtrees);
}

module.exports = async function ({ organismId, collectionId, clientId, precache = false, userId }) {
  const user = await User.findById(userId, { flags: 1 });
  const treeSpec = getCollectionTask(organismId, 'tree', user);
  const subtreeSpec = getCollectionTask(organismId, 'subtree', user);
  if (!treeSpec && !subtreeSpec) return Promise.resolve();
  const treeSubmissions = [];
  if (treeSpec) {
    treeSubmissions.push(enqueue({
      spec: treeSpec,
      metadata: { organismId, collectionId, name: 'collection', clientId },
      precache,
    }));
  }
  if (subtreeSpec) {
    treeSubmissions.concat(getSubtrees(collectionId)
      .then((subtrees) => subtrees.map(({ name }) =>
        enqueue({
          spec: subtreeSpec,
          metadata: { organismId, collectionId, name, clientId }, precache,
        })
      )));
  }

  return Promise.all(treeSubmissions);
};
