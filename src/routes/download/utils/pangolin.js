module.exports.transformer = function (doc) {
  const version = !!doc.analysis.pangolin['pangolin_version'] ? doc.analysis.pangolin['pangolin_version'] : 'Unknown';
  const record = {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    'Version': doc.analysis.pangolin.__v,
    'Pangolin Version': version,
  };
  Object.keys(doc.analysis.pangolin).filter(field => field !== '__v' && field !== 'pangolin_version').forEach((item) => {
    record[item] = doc.analysis.pangolin[item];
  });

  return record;
};
