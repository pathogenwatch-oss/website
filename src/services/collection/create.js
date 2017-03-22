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

function getCollectionAndGenomes(message) {
  return Promise.all([
    createCollection(message),
    getGenomes(message.genomeIds),
  ]);
}

function getCollectionUUID(collection, genomes, { organismId, predefinedIds }) {
  if (predefinedIds) {
    const { collectionId, collectionGenomes } = predefinedIds;
    return Promise.resolve({ collection, collectionId, collectionGenomes });
  }

  return (
    request('backend', 'new-collection', { genomes, organismId })
      .then(({ collectionId, collectionGenomes }) => ({ collection, collectionId, collectionGenomes }))
  );
}

function saveCollectionUUID({ collection, collectionId, collectionGenomes }) {
  return (
    Promise.all([
      collection.addUUID(collectionId),
      request('collection', 'add-genomes', { collection, collectionGenomes }),
    ])
    .then(() => ({ collection, collectionGenomes }))
  );
}

function submitCollection({ collection, collectionGenomes }) {
  const { uuid, organismId } = collection;
  return request('backend', 'submit', { collectionId: uuid, organismId, collectionGenomes });
}

module.exports = function (message) {
  return Promise.resolve(message)
    .then(getCollectionAndGenomes)
    .then(([ collection, genomes ]) =>
      getCollectionUUID(collection, genomes, message)
        .then(saveCollectionUUID)
        .then(submitCollection)
        .then(() => ({ slug: collection.slug }))
        .catch(error => collection.failed(error))
    );
};
