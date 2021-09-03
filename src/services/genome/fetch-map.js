const Genome = require('models/genome');

module.exports = async function (props) {
  const query = {
    latitude: { $exists: true, $ne: null },
    longitude: { $exists: true, $ne: null },
    ...await Genome.getFilterQuery(props),
  };
  return (
    Genome
      .aggregate([
        { $match: query },
        { $group: { _id: { latitude: '$latitude', longitude: '$longitude' }, genomes: { $push: '$_id' } } },
        { $project: { _id: 0, position: [ '$_id.latitude', '$_id.longitude' ], genomes: 1 } },
      ])
  );
};
