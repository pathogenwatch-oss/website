const Genome = require('models/genome');

module.exports = function (props) {
  const query = Object.assign(
    { latitude: { $exists: true }, longitude: { $exists: true } },
    Genome.getFilterQuery(props)
  );
  return (
    Genome
      .find(query, { latitude: 1, longitude: 1, name: 1 })
      .lean()
  );
};
