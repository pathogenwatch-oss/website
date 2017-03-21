const { request } = require('services/bus');

const Collection = require('models/collection');

module.exports = message => {
  const { collectionId, collectionGenomes } = message;

  return Collection.findById(collectionId)
    .then(collection =>
      request('collection', 'add-genomes', { collection, collectionGenomes })
        .then(() => {
          request('backend', 'submit', {
            collectionId: collection.uuid,
            organismId: collection.organismId,
            collectionGenomes,
          });
          return { slug: collection.slug };
        })
        .catch(error => collection.failed(error))
    );
};
