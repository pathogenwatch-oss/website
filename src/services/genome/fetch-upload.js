const Genome = require('models/genome');

module.exports = async function ({ user, query }) {
  const projection = {
    'analysis.cgmlst.__v': 1,
    'analysis.core.__v': 1,
    'analysis.genotyphi.__v': 1,
    'analysis.inctyper.__v': 1,
    'analysis.kleborate.__v': 1,
    'analysis.metrics.__v': 1,
    'analysis.mlst.__v': 1,
    'analysis.mlst.st': 1,
    'analysis.ngmast.__v': 1,
    'analysis.paarsnp.__v': 1,
    'analysis.poppunk.__v': 1,
    'analysis.serotype.__v': 1,
    'analysis.speciator.__v': 1,
    'analysis.speciator.genusId': 1,
    'analysis.speciator.organismId': 1,
    'analysis.speciator.organismName': 1,
    'analysis.speciator.speciesId': 1,
    assembler: 1,
    errored: 1,
    name: 1,
    pending: 1,
    upload: 1,
    uploadedAt: 1,
  };
  const genomes = await Genome.find({ ...query, _user: user._id }, projection).lean();
  return genomes.map(doc => {
    const { analysis = {}, upload = { complete: true, type: Genome.uploadTypes.ASSEMBLY } } = doc;
    const genome = {
      analysis,
      assembler: doc.assembler,
      errored: doc.errored,
      id: doc._id,
      name: doc.name,
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
