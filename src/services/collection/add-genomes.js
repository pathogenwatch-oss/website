const CollectionGenome = require('data/collectionGenome');

module.exports = function ({ collection, collectionGenomes }) {
  return CollectionGenome.insertMany(
    collectionGenomes.map(({ uuid, genome }) =>
      CollectionGenome.convert(genome, uuid, collection._id)
    )
  );
};
