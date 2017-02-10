const Collection = require('models/collection');
const CollectionGenome = require('models/collectionGenome');

const requiredTasks = new Set([
  'CORE',
  'FP',
  'CORE_MUTANT_TREE',
  'SUBMATRIX',
]);

module.exports = function ({ collectionId, assemblyId, taskType }) {
  return (
    assemblyId ?
    CollectionGenome.findByUuid(assemblyId.uuid, { name: 1 }) :
    Promise.resolve(null)
  ).
  then(({ name }) =>
    Collection.findByUuid(collectionId).
      then(collection => {
        collection.progress.errors.push({ taskType, name });

        if (requiredTasks.has(taskType)) {
          return collection.failed(
            `Received error for required task: ${taskType}`
          );
        }
        return collection.save();
      })
  );
};
