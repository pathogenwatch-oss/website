const Genome = require('models/genome');
const { getCollectionSchemes } = require('manifest');

const MAX_PAGE_SIZE = 100;

const preferredTypingSchemes = [
  { analysis: 'pangolin', field: 'lineage' },
  { analysis: 'genotyphi', field: 'genotype' },
];

function inferScheme(analysis) {
  for (const scheme of preferredTypingSchemes) {
    if (analysis.hasOwnProperty(scheme.analysis)) {
      const schemes = {
        type: scheme,
      };
      if (analysis.hasOwnProperty('mlst')) {
        return {
          ...schemes,
          type2: { analysis: 'mlst', field: 'st' },
        };
      }
      return schemes;
    }
  }
  if (analysis.hasOwnProperty('mlst2')) {
    return {
      type: { analysis: 'mlst', field: 'st' },
      type2: { analysis: 'mlst2', field: 'st' },
    };
  }

  if (analysis.hasOwnProperty('mlst')) {
    return {
      type: { analysis: 'mlst', field: 'st' },
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
    .then((genomes) =>
      genomes.map((genome) => {
        const formattedGenome = Genome.toObject(genome, user);
        const { analysis = {} } = genome;
        const { speciator = {}, serotype = {} } = analysis;
        const scheme = inferScheme(analysis);
        formattedGenome.type = scheme.type ? analysis[scheme.type.analysis][scheme.type.field] : null;
        formattedGenome.typeSource = scheme.type ? scheme.type.analysis : null;
        formattedGenome.type2 = scheme.type2 ? analysis[scheme.type2.analysis][scheme.type2.field] : null;
        formattedGenome.typeSource2 = scheme.type2 ? scheme.type2.analysis : null;
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
