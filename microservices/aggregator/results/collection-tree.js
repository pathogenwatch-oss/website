const Collection = require('data/collection');
const mainStorage = require('services/storage')('main');
const { CORE_TREE_RESULT } = require('utils/documentKeys');

module.exports = (taskName, { collectionId }) =>
  mainStorage.retrieve(`${CORE_TREE_RESULT}_${collectionId}`).
    then(({ newickTree }) =>
      Collection.update({ uuid: collectionId }, { tree: newickTree })
    );
