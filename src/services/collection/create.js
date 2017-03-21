const { request } = require('services/bus');
const { ServiceRequestError } = require('utils/errors');

const Collection = require('models/collection');
const Genome = require('models/genome');
const Organism = require('models/organism');

const { maxCollectionSize = 0 } = require('configuration');

function createCollection({ organismId, genomeIds, title, description, user }) {
  if (!organismId) {
    return Promise.reject(new ServiceRequestError('No organism ID provided'));
  }

  if (!genomeIds || !genomeIds.length) {
    return Promise.reject(new ServiceRequestError('No genome IDs provided'));
  }

  if (maxCollectionSize && genomeIds.length > maxCollectionSize) {
    return Promise.reject(new ServiceRequestError('Too many genome IDs provided'));
  }

  const size = genomeIds.length;
  return (
    Organism.getLatest(organismId).
      then(organism =>
        Collection.create({
          _organism: organism,
          _user: user,
          description,
          size,
          organismId,
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
  const { genomeIds, organismId } = message;

  return Promise.all([
    createCollection(message),
    getGenomes(genomeIds),
  ]).
    then(([ collection, genomes ]) =>
      request('backend', 'new-collection', { genomes, organismId }).
        then(({ collectionId, collectionGenomes }) =>
          Promise.all([
            collection.addUUID(collectionId),
            request('collection', 'add-genomes', { collection, collectionGenomes }),
          ]).then(() => {
            request('backend', 'submit', {
              collectionId,
              organismId,
              collectionGenomes,
            });
            return { slug: collection.slug };
          })
        ).
        catch(error => collection.failed(error))
    );
};
