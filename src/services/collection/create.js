const { request } = require('services/bus');
const { ServiceRequestError } = require('utils/errors');

const Collection = require('models/collection');
const Genome = require('models/genome');
const Organism = require('models/organism');

const { maxCollectionSize = 0 } = require('configuration');

function createCollection({ organismId, genomeIds, title, description, pmid, user }) {
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
          organismId,
          pmid,
          size,
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

function checkGenomeOrganismIds([ collection, genomes ]) {
  for (const genome of genomes) {
    if (genome.organismId !== collection.organismId) {
      throw new ServiceRequestError(`A ${collection.organismId} collection cannot include genome (id: ${genome.id}, organismId ${genome.organismId})`);
    }
  }
  return [ collection, genomes ];
}

function getCollectionUUID(genomes, { organismId, ids }) {
  if (ids) {
    const { collectionId, uuidToGenome } = ids;
    return Promise.resolve({ collectionId, uuidToGenome });
  }

  return request('backend', 'new-collection', { genomes, organismId });
}

function saveCollectionUUID({ collection, ids }) {
  const { collectionId, uuidToGenome } = ids;
  return (
    Promise.all([
      collection.addUUID(collectionId),
      request('collection', 'add-genomes', { collection, uuidToGenome }),
    ])
    .then(() => ({ collection, uuidToGenome }))
  );
}

function submitCollection({ collection, uuidToGenome }) {
  const { uuid, organismId } = collection;
  return request('backend', 'submit', { organismId, collectionId: uuid, uuidToGenome });
}

module.exports = function (message) {
  return Promise.resolve(message)
    .then(getCollectionAndGenomes)
    .then(checkGenomeOrganismIds)
    .then(([ collection, genomes ]) =>
      getCollectionUUID(genomes, message)
        .then(ids => ({ collection, ids }))
        .then(saveCollectionUUID)
        .then(submitCollection)
        .then(() => ({ slug: collection.slug }))
        .catch(error => {
          collection.failed(error);
          throw error;
        })
    );
};
