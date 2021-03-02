module.exports.transformer = function (doc) {
  const record = {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: doc.analysis.pangolin.__v,
  };

  Object.keys(doc.analysis.pangolin).filter(field => field !== '__v').forEach((item) => {
    record[item] = doc.analysis.pangolin[item];
  });

  return record;
};
