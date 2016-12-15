const Collection = require('data/collection');
const CollectionGenome = require('data/collectionGenome');

const { ServiceRequestError } = require('utils/errors');

function isReady(collection, results) {
  return (
    (collection.size < 3 || collection.tree) &&
    collection.subtrees.length &&
    Object.keys(results).
      every(type =>
        (collection.resultRequired(type) ?
          results[type] === collection.size :
          true)
      )
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

function checkStatus(collection) {
  if (!collection) throw new ServiceRequestError('Collection not found');
  if (collection.isProcessing) {
    return CollectionGenome.countResults(collection).
      then(results => {
        if (isReady(collection, results)) {
          return collection.ready();
        }
        return calculateProgress(collection, results);
      });
  }
  return collection;
}

module.exports = ({ uuid }) =>
  Collection.
    findOne({ uuid }).
    then(checkStatus);
