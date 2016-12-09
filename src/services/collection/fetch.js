const services = require('services');
const CollectionAssembly = require('data/collectionAssembly');

function addAssemblies(collection) {
  return CollectionAssembly.
    find({ _collection: collection._id }, { _collection: 0 }).
    then(assemblies => {
      collection.assemblies = assemblies.map(_ => _.toObject());
      return collection;
    });
}

module.exports = ({ uuid }) =>
  services.request('collection', 'fetch-progress', { uuid }).
    then(collection => {
      if (collection.status === 'READY') {
        return addAssemblies(collection);
      }
      return collection;
    }).
    then(collection => collection.toObject());
