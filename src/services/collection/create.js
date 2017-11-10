const { request } = require('services/bus');
const { ServiceRequestError } = require('utils/errors');

const Collection = require('models/collection');
const Genome = require('models/genome');
const Organism = require('models/organism');

const { maxCollectionSize = { anonymous: 0, loggedIn: 0 } } = require('configuration');

function getMaxCollectionSize(user) {
  if (user) {
    return user.admin ? null : maxCollectionSize.loggedIn;
  }
  return maxCollectionSize.anonymous;
}

function validate({ genomeIds, organismId, user }) {
  if (!organismId) {
    throw new ServiceRequestError('No organism ID provided');
  }
  if (!genomeIds || !genomeIds.length) {
    throw new ServiceRequestError('No genome IDs provided');
  }

  const maxSize = getMaxCollectionSize(user);
  if (maxSize && genomeIds.length > maxSize) {
    throw new ServiceRequestError('Too many genome IDs provided');
  }

  return Genome.count({
    _id: { $in: genomeIds },
    organismId,
    'analysis.core': { $exists: true },
  })
  .then(count => {
    if (count !== genomeIds.length) {
      throw new ServiceRequestError('Invalid collection request.');
    }
    return genomeIds;
  });
}

function getGenomes(genomeIds) {
  return Genome.find({ _id: { $in: genomeIds } }, {
    fileId: 1,
    name: 1,
    year: 1,
    month: 1,
    day: 1,
    latitude: 1,
    longitude: 1,
    country: 1,
    pmid: 1,
    userDefined: 1,
    organismId: 1,
    'analysis.speciator': 1,
  });
}

function createCollection(genomes, { organismId, title, description, pmid, user, sessionID }) {
  const size = genomes.length;
  return (
    Organism.getLatest(organismId)
      .then(organism =>
        Collection.create({
          _organism: organism,
          _user: user,
          _session: !user ? sessionID : undefined,
          description,
          organismId,
          pmid,
          size,
          title,
        })
      )
      .then(collection =>
        request('collection', 'add-genomes', { collection, genomes })
          .then(collectionGenomes => ({ collection, collectionGenomes }))
      )
  );
}

function submitCollection({ collection, collectionGenomes }) {
  const { _id, uuid, organismId } = collection;
  const uploadedAt = collection.progress.started;
  request('collection', 'submit', {
    organismId,
    collectionGenomes,
    uploadedAt,
    collectionId: _id,
    uuid,
  });
  return collection;
}

module.exports = function (message) {
  return Promise.resolve(message)
    .then(validate)
    .then(getGenomes)
    .then(genomes => createCollection(genomes, message))
    .then(submitCollection)
    .then(({ slug, uuid }) => ({ slug, uuid }));
};
