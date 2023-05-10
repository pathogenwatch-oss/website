module.exports.transformer = function (doc) {
  return {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: doc.analysis.ngmast.__v,
    'NG-Mast': doc.analysis.ngmast.ngmast,
    POR: doc.analysis.ngmast.por,
    TBPB: doc.analysis.ngmast.tbpb,
  };
};
