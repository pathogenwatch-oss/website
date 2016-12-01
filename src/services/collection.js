const { register } = require('./bus');
const { ServiceRequestError } = require('../utils/errors');

const { maxCollectionSize = 0 } = require('../configuration');

const role = 'collection';

function create({ speciesId, title, description, files }) {
  if (!speciesId) {
    return Promise.reject(new ServiceRequestError('No species ID provided'));
  }

  if (!files || !files.length) {
    return Promise.reject(new ServiceRequestError('No files provided'));
  }

  if (files.length > maxCollectionSize) {
    return Promise.reject(new ServiceRequestError('Too many files provided'));
  }

  return notifyBackend(files).
    then(({ collectionId, assemblies }) =>
      createCollection({
        id: collectionId, speciesId, title, description,
      }, assemblies).
        then(() => submitAssemblies({ collectionId, assemblies, speciesId })).
        then(() => collectionId)
    );
}

register(role, 'create', create);
