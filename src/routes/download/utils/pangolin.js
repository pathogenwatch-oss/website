module.exports.transformer = function (doc) {
  const record = {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: doc.analysis.pangolin.__v,
    'Pangolin Version': doc.analysis.pangolin.pangolin_version ? doc.analysis.pangolin.pangolin_version : 'Unknown',
    'Pangolin-data Version': doc.analysis.pangolin.pangolin_data_version ? doc.analysis.pangolin.pangolin_data_version : 'Unknown',
  };
  Object.keys(doc.analysis.pangolin)
    .filter((field) => field !== '__v' && field !== 'pangolin_version' && field !== 'pangolin_data_version')
    .forEach((item) => {
      record[item] = doc.analysis.pangolin[item];
    });

  return record;
};
