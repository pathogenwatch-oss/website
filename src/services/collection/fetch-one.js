const services = require('services');
const CollectionGenome = require('models/collectionGenome');

function addGenomes(collection) {
  console.log(collection);
  if (collection.status !== 'READY') {
    collection.genomes = [];
    return collection;
  }

  return CollectionGenome.
    find({ _collection: collection.id }, { _collection: 0, fileId: 0 }).
    then(genomes => {
      collection.genomes = genomes.map(_ => _.toObject());
      return collection;
    });
}

module.exports = ({ uuid }) =>
  services.request('collection', 'fetch-progress', { uuid }).
    then(collection => (
      collection.status === 'READY' ?
        collection.populate('_species').execPopulate() :
        collection
    )).then(_ => addGenomes(_.toObject()));
