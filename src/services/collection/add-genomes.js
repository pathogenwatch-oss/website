const CollectionGenome = require('data/collectionGenome');

module.exports = function ({ collection, collectionGenomes }) {
  return CollectionGenome.insertMany(
    collectionGenomes.map(({ uuid, genome }) => {
      const { name, year, month, day, latitude, longitude, country, pmid, userDefined } = genome;
      const { fileId, metrics } = genome._file;
      return {
        uuid,
        _collection: collection._id,
        fileId,
        name,
        date: { year, month, day },
        position: { latitude, longitude },
        country,
        pmid,
        userDefined,
        metrics,
      };
    })
  );
};
