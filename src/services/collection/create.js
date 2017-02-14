const { request } = require('services/bus');
const { ServiceRequestError } = require('utils/errors');

const Collection = require('models/collection');
const Genome = require('models/genome');
const Species = require('models/species');

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
  return (
    Species.getLatest(speciesId).
      then(species =>
        Collection.create({
          _species: species,
          _user: user,
          description,
          size,
          speciesId,
          title,
        })
      )
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
            request('collection', 'add-genomes', { collection, collectionGenomes }),
          ]).then(() => {
            request('backend', 'submit', {
              collectionId,
              speciesId,
              collectionGenomes,
            });
            return { slug: collection.slug };
          })
        ).
        catch(error => collection.failed(error))
    );
};