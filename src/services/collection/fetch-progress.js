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

function addProgressResults(collection, results) {
  collection.progress.results = {};
  let totalResults = 0;

  for (const { name, total } of results) {
    collection.progress.results[name] =
      Math.floor(total * 100 / collection.size);
    totalResults += total;
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
        return addProgressResults(collection, results);
      });
  }
  return collection;
}

module.exports = ({ uuid }) =>
  Collection.
    findOne({ uuid }).
    then(checkStatus);
