const Genome = require('models/genome');

module.exports = async function ({ user, query }) {
  const projection = {
    'analysis.alignment.__v': 1,
    'analysis.cgmlst.__v': 1,
    'analysis.klebsiella_lincodes.__v': 1,
    'analysis.cgmlst.source': 1,
    'analysis.core.__v': 1,
    'analysis.genotyphi.__v': 1,
    'analysis.inctyper.__v': 1,
    'analysis.kaptive.__v': 1,
    'analysis.kleborate.__v': 1,
    'analysis.metrics.__v': 1,
    'analysis.mlst.__v': 1,
    'analysis.mlst.st': 1,
    'analysis.mlst.source': 1,
    'analysis.mlst2.__v': 1,
    'analysis.mlst2.source': 1,
    'analysis.ngmast.__v': 1,
    'analysis.ngono-markers.__v': 1,
    'analysis.ngstar.__v': 1,
    'analysis.paarsnp.__v': 1,
    'analysis.pangolin.__v': 1,
    'analysis.pangolin.lineage': 1,
    'analysis.poppunk2.__v': 1,
    'analysis.sarscov2-variants.__v': 1,
    'analysis.serotype.__v': 1,
    'analysis.speciator.__v': 1,
    'analysis.speciator.genusId': 1,
    'analysis.speciator.organismId': 1,
    'analysis.speciator.organismName': 1,
    'analysis.speciator.speciesId': 1,
    'analysis.spn_pbp_amr.__v': 1,
    'analysis.vista.__v': 1,
    assembler: 1,
    errored: 1,
    name: 1,
    pending: 1,
    upload: 1,
    uploadedAt: 1,
  };

  const genomes = [];
  const progress = [];
  const docs = await Genome.find({ ...query, _user: user._id }, projection).lean();
  for (const doc of docs) {
    const { analysis = {}, upload = { complete: true, type: Genome.uploadTypes.ASSEMBLY, files: [] } } = doc;
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
    if (!upload.complete) genome.files = upload.files;
    genomes.push(genome);

    if (upload.type === Genome.uploadTypes.READS) {
      progress.push({
        genomeId: doc._id,
        files: upload.files.map((fileName) => ({ fileId: fileName, complete: upload.complete })),
      });
    }
  }

  return { genomes, progress };
};
