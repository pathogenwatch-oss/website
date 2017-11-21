const { request } = require('services/bus');
const { ServiceRequestError } = require('utils/errors');

const Collection = require('models/collection');
const CollectionGenome = require('models/collectionGenome');
const Genome = require('models/genome');
const Organism = require('models/organism');

const { getTasksByOrganism } = require('../../manifest.js');

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
    speciesId: 1,
    genusId: 1,
  });
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

function addGenomes(genomes) {
  return genomes.map(genome => {
    const { _id, fileId, name, year, month, day, latitude, longitude, country, pmid, userDefined } = genome;
    return {
      _genome: _id,
      fileId,
      name,
      date: { year, month, day },
      position: { latitude, longitude },
      country,
      pmid,
      userDefined,
    };
  });
}

function getAnalysis({ organismId, speciesId, genusId }) {
  const tasks = getTasksByOrganism(organismId, speciesId, genusId);
  return tasks.reduce((memo, { task, version }) => {
    memo[task] = version;
    return memo;
  }, {});
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
          genomes: addGenomes(genomes),
          analysis: getAnalysis(genomes[0]),
        })
      )
  );
}

function submitCollection(collection) {
  const { _id, uuid, organismId } = collection;
  return request('collection', 'submit', {
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
