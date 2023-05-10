module.exports.transformer = function (doc) {
  return {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: doc.analysis.genotyphi.__v,
    Genotype: doc.analysis.genotyphi.genotype,
    'SNPs Called': doc.analysis.genotyphi.foundLoci,
  };
};
