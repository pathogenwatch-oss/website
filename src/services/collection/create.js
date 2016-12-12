const fastaStorage = require('wgsa-fasta-store');

const { request } = require('services/bus');
const { ServiceRequestError } = require('utils/errors');

const Collection = require('data/collection');
const CollectionGenome = require('data/collectionGenome');

const { createRecord } = require('models/assemblyMetadata');

const { maxCollectionSize = 0, fastaStoragePath } = require('configuration');

function createCollection({ speciesId, files, title, description, user }) {
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
    _user: user,
    description,
    size,
    speciesId,
    title,
  });
}

function addAssemblies(collection, assemblies) {
  return CollectionGenome.insertMany(
    assemblies.map(({ uuid, file }) => Object.assign(
      { _collection: collection._id, uuid },
      createRecord({}, file.metadata || { name: file.name }, file.metrics)
    ))
  );
}

module.exports = message => {
  const { files, speciesId } = message;

  return createCollection(message).
    then(collection =>
      request('backend', 'new-collection', { files, speciesId }).
        then(({ collectionId, assemblies }) =>
          Promise.all([
            collection.addUUID(collectionId),
            addAssemblies(collection, assemblies),
          ]).then(() => {
            request('backend', 'submit', {
              collectionId,
              speciesId,
              files: assemblies.map(({ uuid, file }) => ({
                uuid,
                id: file.id,
                path: fastaStorage.getFilePath(fastaStoragePath, file.id),
              })),
            });
            return { collectionId };
          })
        ).
        catch(error => collection.failed(error))
    );
};
