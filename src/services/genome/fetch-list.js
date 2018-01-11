const Genome = require('models/genome');

const config = require('config');

const { pagination = { min: 100, max: 2500 } } = config;

module.exports = function (props) {
  const { user, query = {} } = props;
  const { skip = 0, limit = pagination.min, sort } = query;

  return (
    Genome
      .find(
        Genome.getFilterQuery(props),
        { name: 1,
          'analysis.speciator.organismId': 1,
          'analysis.speciator.organismName': 1,
          'analysis.mlst.st': 1,
          date: 1,
          country: 1,
          reference: 1,
          public: 1,
          uploadedAt: 1,
          _user: 1,
        }, {
          skip: Number(skip),
          limit: Math.min(Number(limit), pagination.max),
          sort: Genome.getSort(sort),
        }
      )
      .lean()
      .then(genomes => genomes.map(genome => {
        const formattedGenome = Genome.toObject(genome, user);
        const { analysis = {} } = genome;
        const { mlst = {}, speciator = {} } = analysis;
        formattedGenome.st = mlst.st;
        formattedGenome.organismId = speciator.organismId;
        formattedGenome.organismName = speciator.organismName;
        return formattedGenome;
      }))
  );
};
