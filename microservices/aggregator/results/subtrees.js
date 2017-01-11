const { isReference } = require('../utils');
const Collection = require('data/collection');
const CollectionGenome = require('data/collectionGenome');
const mainStorage = require('services/storage')('main');
const { CORE_TREE_RESULT } = require('utils/documentKeys');

function parseSubtrees(collectionId, results, totals) {
  return totals.map(({ subtype, count }) => {
    const { newickTree, leafIdentifiers } =
      results[`${CORE_TREE_RESULT}_${collectionId}_${subtype}`];

    return {
      name: subtype,
      tree: newickTree,
      leafIds: leafIdentifiers,
      totalCollection: count,
      totalPublic: leafIdentifiers.length - count - 1, // -1 for reference
    };
  });
}

const countUniqueSubtypes =
  collection => CollectionGenome.countUniqueSubtypes(collection);

function aggregateSubtrees({ collectionId, documentKeys }) {
  Promise.all([
    mainStorage.retrieveMany(documentKeys),
    Collection.findByUuid(collectionId, { _id: 1 }).then(countUniqueSubtypes),
  ]).
  then(([ { results, erroredKeys }, totals ]) => {
    if (erroredKeys.length) throw new Error(`Failed to find ${erroredKeys}`);
    return parseSubtrees(collectionId, results, totals);
  }).
  then(subtrees => Collection.update({ uuid: collectionId }, { subtrees }));
}

module.exports = (taskName, { message }) =>
  (isReference(message) ? Promise.resolve() : aggregateSubtrees(message));
