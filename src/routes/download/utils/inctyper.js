module.exports.transformer = (doc, callback) => {
  const records = [];

  if (!doc.analysis.inctyper || !doc.analysis.inctyper['Inc Matches']) {
    records.push({
      'Genome ID': doc._id.toString(),
      'Genome Name': doc.name,
    });
  } else {
    for (const match of doc.analysis.inctyper['Inc Matches']) {
      const record = {
        'Genome ID': doc._id.toString(),
        'Genome Name': doc.name,
      };
      /* eslint-disable no-return-assign */
      Object.keys(match)
        .forEach((prop) =>
          record[prop.replace('__v', 'Version').replace(/_/g, ' ')] = match[prop]
        );
      records.push(record);
    }
  }
  callback(null, ...records);
};
