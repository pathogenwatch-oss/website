const { request } = require('services/bus');
const { ServiceRequestError } = require('utils/errors');

const Collection = require('data/collection');
const CollectionGenome = require('data/collectionGenome');
const Genome = require('data/genome');

const { maxCollectionSize = 0 } = require('configuration');

function createCollection({ speciesId, genomeIds, title, description, user }) {
  if (!speciesId) {
    return Promise.reject(new ServiceRequestError('No species ID provided'));
  }

  if (!genomeIds || !genomeIds.length) {
    return Promise.reject(new ServiceRequestError('No genome IDs provided'));
  }

  if (maxCollectionSize && genomeIds.length > maxCollectionSize) {
    return Promise.reject(new ServiceRequestError('Too many genome IDs provided'));
  }

  const size = genomeIds.length;
  return Collection.create({
    _user: user,
    description,
    size,
    speciesId,
    title,
  });
}

function addCollectionGenomes(collection, assemblies) {
  return CollectionGenome.insertMany(
    assemblies.map(({ uuid, genome }) => {
      const { name, year, month, day, latitude, longitude, country, pmid, userDefined } = genome;
      const { fileId, metrics } = genome._file;
      return {
        uuid,
        _collection: collection._id,
        fileId,
        name,
        date: { year, month, day },
        position: { latitude, longitude },
        country,
        pmid,
        userDefined,
        metrics,
      };
    })
  );
}

function getGenomes(ids) {
  return Genome.
    find({ _id: { $in: ids } }).
    populate('_file');
}

module.exports = message => {
  const { genomeIds, speciesId } = message;

  return Promise.all([
    createCollection(message),
    getGenomes(genomeIds),
  ]).
    then(([ collection, genomes ]) =>
      request('backend', 'new-collection', { genomes, speciesId }).
        then(({ collectionId, collectionGenomes }) =>
          Promise.all([
            collection.addUUID(collectionId),
            addCollectionGenomes(collection, collectionGenomes),
          ]).then(() => {
            request('backend', 'submit', {
              collectionId,
              speciesId,
              collectionGenomes,
            });
            return { collectionId };
          })
        ).
        catch(error => collection.failed(error))
    );
};
