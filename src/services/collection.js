const { register, request } = require('./bus');
const { ServiceRequestError } = require('../utils/errors');

const Collection = require('../data/collection');
const CollectionAssembly = require('../data/collectionAssembly');
const { createMetadataRecord } = require('models/assemblyMetadata');
const { calculateExpectedResults } = require('../models/analysisResults');

const { maxCollectionSize = 0 } = require('../configuration');

function createCollection({ speciesId, files, title, description }) {
  if (!speciesId) {
    return Promise.reject(new ServiceRequestError('No species ID provided'));
  }

  if (!files || !files.length) {
    return Promise.reject(new ServiceRequestError('No files provided'));
  }

  if (maxCollectionSize && files.length > maxCollectionSize) {
    return Promise.reject(new ServiceRequestError('Too many files provided'));
  }

  const size = files.length;
  return Collection.create({
    description,
    size,
    speciesId,
    submission: {
      totalResultsExpected: calculateExpectedResults(size),
    },
    title,
  });
}

function addAssemblies(collection, uuidToFileMap) {
  return CollectionAssembly.insertMany(
    Object.keys(uuidToFileMap).map(uuid => {
      const file = uuidToFileMap[uuid];
      return Object.assign(
        { collection, _fasta: file.id, uuid },
        createMetadataRecord(
          { speciesId: collection.speciesId },
          file.metadata || { assemblyName: file.name }
        )
      );
    })
  );
}

const role = 'collection';

register(role, 'create', (message) => {
  const { files, speciesId } = message;

  return createCollection(message).
    then(collection =>
      request('backend', 'submit', { files, speciesId }).
        then(({ collectionUuid, uuidToFileMap }) =>
          Promise.all([
            collection.addUUID(collectionUuid),
            addAssemblies(collection, uuidToFileMap),
          ]).then(() => collectionUuid)
        ).
        catch(error => collection.failed(error))
    );
});
