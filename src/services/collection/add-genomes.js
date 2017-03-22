const CollectionGenome = require('models/collectionGenome');

module.exports = function ({ collection, uuidToGenome }) {
  return CollectionGenome.insertMany(
    uuidToGenome.map(([ uuid, genome ]) => {
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
