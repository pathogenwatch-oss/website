const Genome = require('../../models/genome');

module.exports = async function (props) {
  return Genome.find(
    await Genome.getFilterQuery(props),
    { name: 1, 'analysis.speciator.organismId': 1 },
    { lean: true }
  );
};
