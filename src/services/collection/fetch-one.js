const services = require('services');
const CollectionGenome = require('models/collectionGenome');

function addGenomes(collection) {
  if (collection.status !== 'READY') {
    collection.genomes = [];
    return collection;
  }

  return CollectionGenome
    .find({ _collection: collection.id }, { _collection: 0, fileId: 0 })
    .lean()
    .then(genomes => {
      collection.genomes = genomes;
      return collection;
    });
}

module.exports = ({ user, uuid }) =>
  services.request('collection', 'fetch-progress', { user, uuid })
    .then(collection => (
      collection.status === 'READY' ?
        collection.populate('_organism').execPopulate() :
        collection
    ))
    .then(collection => addGenomes(collection.toObject()));
