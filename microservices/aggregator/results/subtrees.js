const Collection = require('models/collection');
const CollectionGenome = require('models/collectionGenome');
const mainStorage = require('services/storage')('main');
const { CORE_TREE_RESULT } = require('utils/documentKeys');

function parseSubtrees(collectionId, results, uuids) {
  return Object.keys(results).map(documentKey => {
    const subtype =
      documentKey.replace(`${CORE_TREE_RESULT}_${collectionId}_`, '');
    const { newickTree, leafIdentifiers } = results[documentKey];

    const idSet = new Set(uuids);
    const collectionIds = [];
    const publicIds = [];
    for (const id of leafIdentifiers) {
      if (idSet.has(id)) {
        collectionIds.push(id);
      } else if (id !== subtype) {
        publicIds.push(id);
      }
    }

    return {
      name: subtype,
      tree: newickTree,
      collectionIds,
      publicIds,
      totalCollection: collectionIds.length,
      totalPublic: publicIds.length,
    };
  });
}

function getUuids({ _id }) {
  return (
    CollectionGenome.find({ _collection: _id }, { uuid: 1, _id: 0 })
      .lean()
      .then(docs => docs.map(_ => _.uuid))
  );
}

module.exports = (taskName, { collectionId, documentKeys }) =>
  Promise.all([
    mainStorage.retrieveMany(documentKeys),
    Collection.findByUuid(collectionId, { _id: 1 })
      .then(getUuids),
  ])
  .then(([ { results, erroredKeys }, uuids ]) => {
    if (erroredKeys.length) throw new Error(`Failed to find ${erroredKeys}`);
    return parseSubtrees(collectionId, results, uuids);
  })
  .then(subtrees => Collection.update({ uuid: collectionId }, { subtrees }));
