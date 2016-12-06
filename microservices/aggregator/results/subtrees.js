const Collection = require('data/collection');
const mainStorage = require('services/storage')('main');
const { CORE_TREE_RESULT } = require('utils/documentKeys');

function parseSubtrees(results, collectionId) {
  return Object.keys(results).map(key => {
    const { newickTree, leafIdentifiers } = results[key];
    const name =
      key.replace(new RegExp(`^${CORE_TREE_RESULT}_${collectionId}_`), '');
    return {
      name,
      tree: newickTree,
      leafIds: leafIdentifiers,
    };
  });
}

module.exports = (taskName, { collectionId, documentKeys }) =>
  mainStorage.retrieveMany(documentKeys).
    then(({ results, erroredKeys }) => {
      if (erroredKeys.length) return new Error(`Failed to find ${erroredKeys}`);
      return Collection.update(
        { uuid: collectionId },
        { subtrees: parseSubtrees(results, collectionId) }
      );
    });
