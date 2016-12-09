const Collection = require('data/collection');
const CollectionGenome = require('data/collectionGenome');

const { ServiceRequestError } = require('utils/errors');

function countGenomeResults(collection) {
  return CollectionGenome.aggregate([
    { $match: { _collection: collection._id } },
    { $project: { analysis: 1 } },
    { $unwind: '$analysis' },
    { $group: { _id: '$analysis.name', total: { $sum: 1 } } },
    { $project: { name: '$_id', _id: 0, total: 1 } },
  ]);
}

function isReady(collection, results) {
  return (
    (collection.size < 3 || collection.tree) &&
    collection.subtrees.length &&
    results.length === collection.totalGenomeResults &&
    results.every(({ total }) => total === collection.size)
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
    return countGenomeResults(collection).
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
