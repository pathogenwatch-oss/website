module.exports.transformer = function (doc) {

  const { cgmlst } = doc.analysis;
  return {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: cgmlst.__v,
    code: cgmlst.code,
    cgST: cgmlst.st,
  };
};
