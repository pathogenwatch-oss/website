module.exports.transformer = function (doc) {

  const label = doc.label === 'GPSC' ? 'Strain' : 'Lineage';

  const row = {};
  row['Genome ID'] = doc._id.toString();
  row['Genome Name'] = doc.name;
  row[label] = doc.analysis.poppunk2.strain;
  row['Image Version'] = doc.analysis.poppunk2.__v;

  if ('versions' in doc.analysis.poppunk2) {
    for (const version in doc.analysis.poppunk2.versions) {
      const name = `${version[0].toUpperCase()}${version.slice(1)} Version`;
      row[name] = doc.analysis.poppunk2.versions[version];
    }
  }
  return row;
};
