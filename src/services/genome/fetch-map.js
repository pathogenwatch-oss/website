const Genome = require('models/genome');

module.exports = function (props) {
  const query = Object.assign(
    { latitude: { $exists: true, $ne: null }, longitude: { $exists: true, $ne: null } },
    Genome.getFilterQuery(props)
  );
  return (
    Genome
      .aggregate([
        { $match: query },
        { $group: { _id: { latitude: '$latitude', longitude: '$longitude' }, genomes: { $push: '$_id' } } },
        { $project: { _id: 0, position: [ '$_id.latitude', '$_id.longitude' ], genomes: 1 } },
      ])
  );
};
