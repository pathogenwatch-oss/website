const Genome = require('models/genome');
const { getCollectionSchemes } = require('manifest');

const MAX_PAGE_SIZE = 100;

module.exports = function (props) {
  const { user, query = {} } = props;
  const { skip = 0, limit = MAX_PAGE_SIZE, sort } = query;
  const schemes = new Set(getCollectionSchemes(user));
  return Genome.find(
    Genome.getFilterQuery(props),
    {
      _user: 1,
      'analysis.mlst.st': 1,
      'analysis.mlst2.st': 1,
      'analysis.serotype.subspecies': 1,
      'analysis.serotype.value': 1,
      'analysis.speciator.organismId': 1,
      'analysis.speciator.speciesName': 1,
      country: 1,
      day: 1,
      month: 1,
      name: 1,
      public: 1,
      reference: 1,
      uploadedAt: 1,
      year: 1,
    },
    {
      skip: Number(skip),
      limit: Number(limit),
      // limit: Math.min(Number(limit), MAX_PAGE_SIZE),
      sort: Genome.getSort(sort),
    }
  )
    .lean()
    .then(genomes =>
      genomes.map(genome => {
        const formattedGenome = Genome.toObject(genome, user);
        const { analysis = {} } = genome;
        const { mlst = {}, mlst2 = {}, speciator = {}, serotype = {} } = analysis;
        formattedGenome.st = mlst.st;
        formattedGenome.st2 = mlst2.st;
        formattedGenome.organismId = speciator.organismId;
        formattedGenome.speciesName = speciator.speciesName;
        formattedGenome.subspecies = serotype.subspecies;
        formattedGenome.serotype = serotype.value;
        if (genome.reference && !schemes.has(speciator.organismId)) {
          genome.reference = false;
        }
        return formattedGenome;
      })
    );
};
