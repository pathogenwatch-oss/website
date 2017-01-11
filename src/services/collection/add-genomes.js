const CollectionGenome = require('data/collectionGenome');

module.exports = function ({ collection, collectionGenomes }) {
  return CollectionGenome.insertMany(
    collectionGenomes.map(genomeAndUuid =>
      CollectionGenome.convert(genomeAndUuid, collection._id)
    )
  );
};
