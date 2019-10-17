module.exports.transformer = function (doc) {
  const record = {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
  };

  Object.keys(doc.analysis.kleborate).forEach(
    prop =>
      (record[prop.replace('__v', 'Version').replace(/_/g, ' ')] = doc.analysis.kleborate[prop])
  );
  return record;
};
