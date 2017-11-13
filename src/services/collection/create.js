const { request } = require('services/bus');
const { ServiceRequestError } = require('utils/errors');

const Collection = require('models/collection');
const CollectionGenome = require('models/collectionGenome');
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

function getLocations(genomes) {
  const locations = {};
  for (const { latitude, longitude } of genomes) {
    if (latitude && longitude) {
      locations[`${latitude}_${longitude}`] = [ latitude, longitude ];
    }
  }
  return Object.values(locations);
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
      .then(collection => ({ collection, genomes }))
  );
}

function addGenomes({ collection, genomes }) {
  const docs = genomes.map(genome => {
    const { _id, fileId, name, year, month, day, latitude, longitude, country, pmid, userDefined } = genome;
    return {
      _collection: collection._id,
      _genome: _id,
      fileId,
      name,
      date: { year, month, day },
      position: { latitude, longitude },
      country,
      pmid,
      userDefined,
      analysis: {},
    };
  });

  return Promise.all([
    CollectionGenome.insertRaw(docs),
    Collection.update({ _id: collection._id }, { locations: getLocations(genomes) }),
  ])
  .then(() => ({ collection, genomes }));
}

function submitCollection({ collection, genomes }) {
  const { _id, uuid, organismId } = collection;
  const uploadedAt = collection.progress.started;
  const { speciesId, genusId } = genomes[0].analysis.speciator;
  request('collection', 'submit', {
    organismId,
    speciesId,
    genusId,
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
    .then(addGenomes)
    .then(submitCollection)
    .then(({ slug, uuid }) => ({ slug, uuid }));
};
