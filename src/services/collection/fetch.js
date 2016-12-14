const services = require('services');
const CollectionGenome = require('data/collectionGenome');

function addGenomes(collection) {
  return CollectionGenome.
    find({ _collection: collection._id }, { _collection: 0, fileId: 0 }).
    then(genomes => {
      collection.genomes = genomes.map(_ => _.toObject());
      return collection;
    });
}

module.exports = ({ uuid }) =>
  services.request('collection', 'fetch-progress', { uuid }).
    then(collection => {
      if (collection.status === 'READY') {
        return addGenomes(collection);
      }
      return collection;
    }).
    then(collection => collection.toObject());
