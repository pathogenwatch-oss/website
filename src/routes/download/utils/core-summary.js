module.exports.transformer = function (doc) {
  return {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: doc.analysis.core.__v,
    'Species Identifier': doc.analysis.core.summary.speciesId,
    'No. Matched Families': doc.analysis.core.summary.familiesMatched,
    'No. Complete Alleles': doc.analysis.core.summary.completeAlleles,
    'Kernel Size (nts)': doc.analysis.core.summary.kernelSize,
    '% Kernel Matched': doc.analysis.core.summary.percentKernelMatched,
    'Pathogenwatch Reference': doc.analysis.core.fp.reference,
  };
};