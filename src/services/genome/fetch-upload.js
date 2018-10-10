const Genome = require('models/genome');
const { getFlagsForUser } = require('utils/flags');

module.exports = async function (props) {
  const { user } = props;
  const projection = {
    name: 1,
    uploadedAt: 1,
    pending: 1,
    errored: 1,
    'analysis.speciator.organismId': 1,
    'analysis.speciator.organismName': 1,
    'analysis.mlst.st': 1,
    'analysis.speciator.__v': 1,
    'analysis.mlst.__v': 1,
    'analysis.cgmlst.__v': 1,
    'analysis.core.__v': 1,
    'analysis.paarsnp.__v': 1,
    'analysis.metrics.__v': 1,
    'analysis.ngmast.__v': 1,
    'analysis.genotyphi.__v': 1,
    'analysis.kleborate.__v': 1,
  };
  const genomes = await Genome
    .find(
      Genome.getFilterQuery(props),
      projection
    )
    .lean();

  const flags = getFlagsForUser(user);
  return genomes.map(genome => {
    const { analysis = {} } = genome;
    const { mlst = {}, speciator = {} } = analysis;
    genome.id = genome._id;
    genome._id = undefined;
    genome.st = mlst.st;
    genome.organismId = speciator.organismId;
    genome.organismName = speciator.organismName;
    for (const task of Object.keys(analysis)) {
      analysis[task] = analysis[task].__v;
    }
    if (!flags.showKlebExperiment() && genome.organismId === '573') {
      genome.pending = (genome.pending || []).filter(t => !([ 'core', 'kleborate' ].includes(t)));
      genome.analysis.kleborate = undefined;
      genome.analysis.core = undefined;
    }
    return genome;
  });
};
