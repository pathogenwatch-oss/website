const Collection = require('models/collection');
const CollectionGenome = require('models/collectionGenome');
const mainStorage = require('services/storage')('main');
const { CORE_TREE_RESULT } = require('utils/documentKeys');

function parseSubtrees(collectionId, results, fileIds) {
  return Object.keys(results).map(documentKey => {
    const subtype =
      documentKey.replace(`${CORE_TREE_RESULT}_${collectionId}_`, '');
    const { newickTree, leafIdentifiers } = results[documentKey];

    const leafIdSet = new Set(leafIdentifiers);
    let count = 0;
    for (const id of fileIds) {
      if (leafIdSet.has(id)) count++;
    }

    return {
      name: subtype,
      tree: newickTree,
      leafIds: leafIdentifiers,
      totalCollection: count,
      totalPublic: leafIdentifiers.length - count - 1, // -1 for reference
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
  .then(([ { results, erroredKeys }, fileIds ]) => {
    if (erroredKeys.length) throw new Error(`Failed to find ${erroredKeys}`);
    return parseSubtrees(collectionId, results, fileIds);
  })
  .then(subtrees => Collection.update({ uuid: collectionId }, { subtrees }));
