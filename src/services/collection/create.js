const { request } = require('services/bus');
const { ServiceRequestError } = require('utils/errors');

const Collection = require('models/collection');
const Genome = require('models/genome');
const Organism = require('models/organism');

const { getTasksByOrganism } = require('../../manifest.js');

const {
  maxCollectionSize = { anonymous: 0, loggedIn: 0 },
  tasks: { collectionIgnore = [] },
} = require('configuration');

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
    'analysis.speciator.organismId': organismId,
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
  return Genome.find(
    { _id: { $in: genomeIds } },
    { latitude: 1, longitude: 1, 'analysis.core.fp.reference': 1 }
  );
}

function getLocations(genomes) {
  const locations = {};
  for (const { latitude, longitude } of genomes) {
    if (latitude && longitude) {
      locations[`${latitude}_${longitude}`] = [ latitude, longitude ];
    }
  }
  return Object.values(locations);
}

function getSubtrees(genomes) {
  const fps = new Set();
  for (const { analysis = {} } of genomes) {
    if (analysis.core && analysis.core.fp && analysis.core.fp.reference) {
      fps.add(analysis.core.fp.reference);
    }
  }
  const subtrees = [];
  for (const name of Array.from(fps)) {
    subtrees.push({
      name,
      status: 'PENDING',
    });
  }
  return subtrees;
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
          locations: getLocations(genomes),
          subtrees: getSubtrees(genomes),
          genomes: genomes.map(_ => _._id),
          tree: {
            name: 'collection',
          },
        })
      )
  );
}

function submitCollection(collection) {
  const { _id, uuid, organismId } = collection;
  return request('collection', 'submit-tree', {
    organismId,
    collectionId: _id,
    clientId: uuid,
  })
  .then(() => collection);
}

module.exports = function (message) {
  return Promise.resolve(message)
    .then(validate)
    .then(getGenomes)
    .then(genomes => createCollection(genomes, message))
    .then(submitCollection)
    .then(({ slug, uuid }) => ({ slug, uuid }));
};
