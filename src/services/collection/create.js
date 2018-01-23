
const { request } = require('services/bus');
const { ServiceRequestError } = require('utils/errors');
const { getCollectionTask } = require('manifest');

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
  )
  .lean();
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

function getSubtrees(organismId, genomes) {
  const spec = getCollectionTask(organismId, 'subtree');
  if (!spec) return null;
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
  const tree = genomes.length >= 3 ? { name: 'collection' } : null;
  return (
    Organism.getLatest(organismId)
      .then(organism =>
        Collection.create({
          _organism: organism,
          _session: !user ? sessionID : undefined,
          _user: user,
          access: user ? 'private' : 'shared',
          description,
          genomes: genomes.map(_ => _._id),
          locations: getLocations(genomes),
          organismId,
          pmid,
          size,
          subtrees: getSubtrees(organismId, genomes),
          title,
          token: Collection.generateToken(title),
          tree,
        })
      )
  );
}

function submitCollection(collection) {
  const { _id, token, organismId } = collection;
  const submitType = collection.tree ? 'submit-tree' : 'submit-subtrees';
  return request('collection', submitType, {
    organismId,
    collectionId: _id,
    clientId: token,
  })
  .then(() => collection);
}

module.exports = function (message) {
  return Promise.resolve(message)
    .then(validate)
    .then(getGenomes)
    .then(genomes => createCollection(genomes, message))
    .then(submitCollection)
    .then(({ token }) => ({ token }));
};
