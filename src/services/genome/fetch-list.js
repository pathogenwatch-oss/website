const Genome = require('models/genome');
const { getCollectionSchemes } = require('manifest');

const config = require('configuration');
const { pagination = { min: 100, max: 2500 } } = config;

function shouldLimit(filters) {
  const keys = Object.keys(filters);
  if (keys.length === 1) {
    return keys[0] === 'prefilter';
  }
  return keys.length === 0;
}

module.exports = function (props) {
  const { user, query = {} } = props;
  const { skip = 0, limit = pagination.max, sort, ...filters } = query;
  const schemes = new Set(getCollectionSchemes(user));
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
          limit: shouldLimit(filters) ? Math.min(Number(limit), pagination.max) : null,
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
        if (genome.reference && !schemes.has(speciator.organismId)) {
          genome.reference = false;
        }
        return formattedGenome;
      }))
  );
};
