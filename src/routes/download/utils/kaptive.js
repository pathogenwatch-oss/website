module.exports.transformer = (doc) => {
  const record = {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: doc.analysis.kaptive.__v,
    'Kaptive Version': doc.analysis.kaptive.kaptiveVersion,
  };
  for (const column of doc.analysis.kaptive.columns) {
    const kName = `K Locus: ${column}`;
    record[kName] = doc.analysis.kaptive.kLocus[column];
  }
  for (const column of doc.analysis.kaptive.columns) {
    const oName = `O Locus: ${column}`;
    record[oName] = doc.analysis.kaptive.oLocus[column];
  }
  return record;
};
