const Genome = require('models/genome');
const { getCollectionSchemes } = require('manifest');

const MAX_PAGE_SIZE = 100;

const preferredTypingSchemes = [ { name:'pangolin', field:'lineage' }, { name:'genotyphi', field: 'genotype' } ];

function inferScheme(analysis) {
  for (const scheme of preferredTypingSchemes) {
    if (analysis.hasOwnProperty(scheme.name)) {
      return {
        type: scheme,
      }
    }
  }
  if (analysis.hasOwnProperty('mlst2')) {
    return {
      type: { name:'mlst', field:'st' },
      type2: { name:'mlst2', field:'st' }
    };
  }
  if (analysis.hasOwnProperty('mlst')) {
    return {
      type: { name:'mlst', field:'st' },
    };
  }
  return {};
}

module.exports = async function (props) {
  const { user, query = {} } = props;
  const { skip = 0, limit = MAX_PAGE_SIZE, sort } = query;
  const schemes = new Set(getCollectionSchemes(user));
  return Genome.find(
    await Genome.getFilterQuery(props),
    {
      _user: 1,
      'analysis.mlst.st': 1,
      'analysis.mlst2.st': 1,
      'analysis.pangolin.lineage': 1,
      'analysis.genotyphi.genotype': 1,
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
        const { speciator = {}, serotype = {} } = analysis;
        const preferredTypingSchemes = inferScheme(analysis);
        formattedGenome.type = !!preferredTypingSchemes.type ? analysis[preferredTypingSchemes.type.name][preferredTypingSchemes.type.field] : null;
        formattedGenome.typeSource = !!preferredTypingSchemes.type ? preferredTypingSchemes.type.name : null;
        formattedGenome.type2 = !!preferredTypingSchemes.type2 ? analysis[preferredTypingSchemes.type2.name][preferredTypingSchemes.type2.field] : null;
        formattedGenome.organismId = speciator.organismId;
        formattedGenome.speciesName = speciator.speciesName;
        formattedGenome.subspecies = speciator.organismId === '2697049' ? 'SARS-CoV-2' : serotype.subspecies;
        formattedGenome.serotype = serotype.value;
        if (genome.reference && !schemes.has(speciator.organismId)) {
          genome.reference = false;
        }
        return formattedGenome;
      })
    );
};
