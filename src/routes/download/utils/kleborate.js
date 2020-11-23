module.exports.transformer = function (doc) {
  const record = {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: doc.analysis.kleborate.__v,
    'Kleborate version': doc.analysis.kleborate['Kleborate version'],
  };

  doc.analysis.kleborate.csv.forEach((item) => {
    if (item.set === '') {
      record[item.name] = doc.analysis.kleborate[item.field];
    } else if (item.set === 'amr') {
      record[item.name] = doc.analysis.kleborate[item.set].classes[item.field];
    } else {
      record[item.name] = doc.analysis.kleborate[item.set][item.field];
    }
  });

  return record;
};
