const Genome = require('models/genome');

module.exports = function (props) {
  const { user } = props;
  return (
    Genome
      .find(
        Genome.getFilterQuery(props),
        { name: 1,
          organismId: 1,
          'analysis.specieator.organismId': 1,
          'analysis.specieator.organismName': 1,
          'analysis.mlst.st': 1,
          'analysis.metrics.__v': 1,
          'analysis.paarsnp.__v': 1,
          'analysis.genotyphi.__v': 1,
          'analysis.ngmast.__v': 1,
          uploadedAt: 1,
          pending: 1,
        },
      )
      .lean()
      .then(genomes => genomes.map(_ => Genome.toObject(_, user)))
  );
};
