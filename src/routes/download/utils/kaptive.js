module.exports.transformer = (doc) => {
  const record = {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
  };

  if ('analysis' in doc && 'kaptive' in doc.analysis) {
    record.Version = doc.analysis.kaptive.__v;
    record['Kaptive Version'] = doc.analysis.kaptive.kaptiveVersion;
    for (const column of Object.keys(doc.analysis.kaptive.kLocus)) {
      if (column === 'name') continue;
      // const kName = `K Locus: ${column}`;
      record[`${doc.analysis.kaptive.kLocus.name} locus: ${column}`] = doc.analysis.kaptive.kLocus[column];
    }
    for (const column of Object.keys(doc.analysis.kaptive.oLocus)) {
      if (column === 'name') continue;
      // const oName = `O Locus: ${column}`;
      record[`${doc.analysis.kaptive.oLocus.name} locus: ${column}`] = doc.analysis.kaptive.oLocus[column];
    }
  }
  return record;
};
