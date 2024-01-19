module.exports.transformer = function (doc) {
  return {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: doc.analysis.poppunk2.__v,
    Lineage: doc.analysis.poppunk2.strain,
  };
};
