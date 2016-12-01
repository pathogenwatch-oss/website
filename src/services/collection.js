const { register, request } = require('./bus');
const { ServiceRequestError } = require('../utils/errors');

const Collection = require('../data/collection');
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

function addAssemblies(collection, files) {
  return Promise.resolve();
}

const role = 'collection';

register(role, 'create', (message) => {
  const { files, speciesId } = message;

  return createCollection(message).
    then(collection =>
      addAssemblies(collection, files).
        then(() => request('backend', 'submit', { files, speciesId })).
          then(uuid => collection.addUUID(uuid)).
          catch(error => collection.failed(error))
    );
});
