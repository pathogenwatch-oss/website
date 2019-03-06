const Genome = require('models/genome');

module.exports = async function ({ user, query }) {
  const projection = {
    name: 1,
    uploadedAt: 1,
    pending: 1,
    errored: 1,
    upload: 1,
    'analysis.speciator.organismId': 1,
    'analysis.speciator.speciesId': 1,
    'analysis.speciator.genusId': 1,
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
    'analysis.inctyper.__v': 1,
  };
  const genomes = await Genome.find({ ...query, _user: user._id }, projection).lean();
  return genomes.map(doc => {
    const { analysis = {}, upload = { complete: true, type: Genome.uploadTypes.ASSEMBLY } } = doc;
    const genome = {
      analysis,
      errored: doc.errored,
      id: doc._id,
      pending: doc.pending,
      type: upload.type,
      uploadedAt: doc.uploadedAt,
    };
    if (!upload.complete) {
      genome.files = upload.files;
    }
    return genome;
  });
};
