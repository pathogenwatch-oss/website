const Collection = require('models/collection');
const CollectionGenome = require('models/collectionGenome');

function getLocations(genomes) {
  const locations = {};
  for (const { latitude, longitude } of genomes) {
    if (latitude && longitude) {
      locations[`${latitude}_${longitude}`] = [ latitude, longitude ];
    }
  }
  return Object.values(locations);
}

module.exports = function ({ collection, genomes }) {
  const docs = genomes.map(genome => {
    const { _id, fileId, name, year, month, day, latitude, longitude, country, pmid, userDefined } = genome;
    return {
      _collection: collection._id,
      _genome: _id,
      fileId,
      name,
      date: { year, month, day },
      position: { latitude, longitude },
      country,
      pmid,
      userDefined,
      analysis: {},
    };
  });

  return Promise.all([
    CollectionGenome.insertRaw(docs),
    Collection.update({ _id: collection._id }, { locations: getLocations(genomes) }),
  ])
  .then(([ ids ]) => {
    for (const [ index, id ] of ids.entries()) {
      docs[index]._id = id;
      docs[index].analysis = genomes[index].analysis;
    }
    return docs;
  });
};
