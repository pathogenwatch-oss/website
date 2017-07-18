const CollectionGenome = require('models/collectionGenome');

module.exports = function ({ collection, uuidToGenome }) {
  return CollectionGenome.insertMany(
    uuidToGenome.map(([ uuid, genome ]) => {
      const { _id, fileId, name, year, month, day, latitude, longitude, country, pmid, userDefined, analysis } = genome;
      return {
        uuid,
        _collection: collection._id,
        _genome: _id,
        fileId,
        name,
        date: { year, month, day },
        position: { latitude, longitude },
        country,
        pmid,
        userDefined,
        analysis,
      };
    })
  );
};
