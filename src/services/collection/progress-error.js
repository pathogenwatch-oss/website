const Collection = require('data/collection');
const CollectionGenome = require('data/collectionGenome');

module.exports = function ({ collectionId, assemblyId, taskType }) {
  return (
    assemblyId ?
    CollectionGenome.findByUuid(assemblyId.uuid, { name: 1 }) :
    Promise.resolve(null)
  ).
  then(({ name }) =>
    Collection.update(
      { uuid: collectionId },
      { $push: { 'progress.errors': { taskType, name } } }
    )
  );
};
