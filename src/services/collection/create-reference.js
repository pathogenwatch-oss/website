const { ServiceRequestError } = require('utils/errors');

const Collection = require('data/collection');
const CollectionGenome = require('data/collectionGenome');

module.exports = function ({ speciesId }) {
  if (!speciesId) {
    return Promise.reject(new ServiceRequestError('No species ID provided'));
  }

  return (
    Collection.findOne({ uuid: speciesId, reference: true }).
    then(collection => {
      if (!collection) return Promise.resolve();

      return Promise.all([
        collection.remove(),
        CollectionGenome.remove({ _collection: collection._id }),
      ]);
    }).
    then(
      Collection.create({
        speciesId,
        uuid: speciesId,
        reference: true,
        title: `${speciesId} Reference Collection`,
      })
    )
  );
};
