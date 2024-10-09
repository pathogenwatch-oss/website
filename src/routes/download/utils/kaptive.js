module.exports.transformer = (doc) => {
  const record = {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: doc.analysis.kaptive.__v,
    'Kaptive Version': doc.analysis.kaptive.kaptiveVersion,
  };
  for (const column of Object.keys(doc.analysis.kaptive.kLocus)) {
    // const kName = `K Locus: ${column}`;
    record[column] = doc.analysis.kaptive.kLocus[column];
  }
  for (const column of Object.keys(doc.analysis.kaptive.oLocus)) {
    // const oName = `O Locus: ${column}`;
    record[column] = doc.analysis.kaptive.oLocus[column];
  }
  return record;
};
