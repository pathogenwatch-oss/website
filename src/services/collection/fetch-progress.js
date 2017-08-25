const Collection = require('models/collection');
const CollectionGenome = require('models/collectionGenome');
const Organism = require('models/organism');

const { NotFoundError } = require('utils/errors');

function isReady(collection, results) {
  return (
    (collection.size < 3 || collection.tree) &&
    (collection.reference || collection.subtrees.length) &&
    results.every(({ type, count }) => (
      collection.resultRequired(type) ?
        count === collection.size :
        true
    ))
  );
}

function calculateProgress(collection, results) {
  collection.progress.results = {};
  let totalResults = 0;

  for (const { type, count } of results) {
    collection.progress.results[type] =
      Math.floor(count * 100 / collection.size);
    totalResults += count;
  }

  if (collection.tree) totalResults++;
  if (collection.subtrees.length) totalResults++;

  collection.progress.percent =
    Math.floor(totalResults * 100 / collection.totalResultsExpected);
  return collection;
}

function factorErrors(results, errors = []) {
  for (const error of errors) {
    const result = results.find(_ => _.type === error.taskType.toLowerCase());
    if (result) result.count++;
  }
  return results;
}

function checkStatus(collection) {
  if (!collection) throw new NotFoundError('Collection not found');
  if (collection.isProcessing) {
    return CollectionGenome.countResults(collection)
      .then(results => factorErrors(results, collection.progress.errors))
      .then(results => {
        if (isReady(collection, results)) {
          return (
            collection.reference ?
              Organism.deploy(collection) :
              collection.ready()
          );
        }
        return calculateProgress(collection, results);
      });
  }
  return collection;
}

module.exports = ({ uuid, withIds = false }) => {
  const projection = Object.assign(
    { 'subtrees.tree': 0 },
    withIds ?
      { 'subtrees.publicIds': 0 } :
      { 'subtrees.publicIds': 0, 'subtrees.collectionIds': 0 }
  );

  return (
    Collection
      .findByUuid(uuid, projection)
      .then(checkStatus)
  );
};
