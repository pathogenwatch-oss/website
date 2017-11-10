const services = require('services');
const CollectionGenome = require('models/collectionGenome');

function addGenomes(collection) {
  if (collection.status !== 'READY') {
    collection.genomes = [];
    return collection;
  }

  return CollectionGenome
    .find({ _collection: collection.id }, {
      _collection: 0,
      fileId: 0,
      'analysis.core.coreProfile': 0,
      'analysis.mlst.matches': 0,
      'analysis.paarsnp.matches': 0,
    })
    .lean()
    .then(genomes => {
      collection.genomes = genomes.map(genome => Object.assign(genome, { uuid: genome._id }));
      return collection;
    });
}

module.exports = ({ user, uuid, withIds = false }) =>
  services.request('collection', 'fetch-progress', { user, uuid, withIds })
    .then(collection => collection.ensureAccess(user))
    .then(collection => {
      if (collection.status === 'READY') {
        return (
          collection
            .populate('_organism')
            .execPopulate()
            .then(_ => addGenomes(_.toObject()))
        );
      }
      return collection;
    });
