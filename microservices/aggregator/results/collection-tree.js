const Collection = require('data/collection');
const Species = require('data/species');

const mainStorage = require('services/storage')('main');
const { CORE_TREE_RESULT } = require('utils/documentKeys');

function fetchTree(collectionId) {
  return mainStorage.retrieve(`${CORE_TREE_RESULT}_${collectionId}`);
}

module.exports = (taskName, { collectionId, speciesId }) =>
  fetchTree(collectionId).
    then(({ newickTree }) =>
      (collectionId === speciesId ?
        Species.aggregateMetadata(speciesId, newickTree) :
        Collection.update({ uuid: collectionId }, { tree: newickTree })
      )
    );
