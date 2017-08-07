const Collection = require('models/collection');
const CollectionGenome = require('models/collectionGenome');

function getLocations(uuidToGenome) {
  const locations = {};
  for (const [ , { latitude, longitude } ] of uuidToGenome) {
    if (latitude && longitude) {
      locations[`${latitude}_${longitude}`] = [ latitude, longitude ];
    }
  }
  return Object.values(locations);
}

module.exports = function ({ collection, uuidToGenome }) {
  return Promise.all([
    CollectionGenome.insertMany(
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
    ),
    Collection.update({ _id: collection._id }, { locations: getLocations(uuidToGenome) }),
  ]);
};
