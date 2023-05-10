const subspeciesKey = 'subspecies';

module.exports.labels = {
  28901: 'Serovar', // Salmonella enterica
  54736: 'Serovar', // Salmonella bongori
  general: 'Serotype',
};

module.exports.transformer = (label) => (doc) => {
  const row = {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: doc.analysis.serotype.__v,
  };
  if (subspeciesKey in doc.analysis.serotype) {
    row.Subspecies = doc.analysis.serotype[subspeciesKey];
  }
  row[label] = doc.analysis.serotype.value;
  return row;
};
