const Genome = require('models/genome');

const config = require('configuration');

const maxLimit = config.maxCollectionSize.loggedIn || 500;

module.exports = function (props) {
  const { user, query = {} } = props;
  const { skip = 0, limit = maxLimit, sort } = query;

  return (
    Genome
      .find(
        Genome.getFilterQuery(props),
        { name: 1,
          organismId: 1,
          'analysis.specieator.organismName': 1,
          'analysis.mlst.st': 1,
          date: 1,
          country: 1,
          reference: 1,
          public: 1,
          uploadedAt: 1,
          _user: 1,
        },
        { skip: Number(skip), limit: Math.min(Number(limit), maxLimit), sort: Genome.getSort(sort) }
      )
      .lean()
      .then(genomes => genomes.map(genome => {
        const { analysis = {} } = genome;
        if (analysis.specieator) {
          genome.organismName = analysis.specieator.organismName;
        }
        if (analysis.mlst) {
          genome.st = analysis.mlst.st;
        }
        genome.analysis = undefined;
        return Genome.toObject(genome, user);
      }))
  );
};
