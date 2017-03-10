const Collection = require('models/collection');
const CollectionGenome = require('models/collectionGenome');
const Organism = require('models/organism');

const { ServiceRequestError } = require('utils/errors');
const { looseAccessControl } = require('configuration');

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

function checkStatus(collection) {
  if (!collection) throw new ServiceRequestError('Collection not found');
  if (collection.isProcessing) {
    return CollectionGenome.countResults(collection).
      then(results => {
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

module.exports = ({ user = null, uuid, aggregator }) => {
  return (
    Collection.
      findOne(
        Object.assign({ uuid }, (looseAccessControl || aggregator) ? {} : { $or: [ { _user: user }, { public: true } ] }),
        { 'subtrees.tree': 0, 'subtrees.leafIds': 0 }
      ).
      then(checkStatus)
  );
};
