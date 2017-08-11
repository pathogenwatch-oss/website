const Genome = require('models/genome');

module.exports = function (props) {
  const { user } = props;
  return (
    Genome
      .find(
        Genome.getFilterQuery(props),
        { name: 1,
          organismId: 1,
          'analysis.specieator': 1,
          'analysis.mlst': 1,
          uploadedAt: 1,
        },
      )
      .lean()
      .then(genomes => genomes.map(_ => Genome.toObject(_, user)))
  );
};
