const sanitize = require('sanitize-filename');
const csv = require('csv');
const Genome = require('models/genome');

const transformer = (doc, callback) => {
  const records = [];

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
  callback(null, ...records);
};

module.exports = (req, res) => {
  const { user } = req;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'inctyper.csv';
  const { ids } = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = {
    _id: { $in: ids.split(',') },
    'analysis.inctyper': { $exists: true },
    ...Genome.getPrefilterCondition({ user }),
  };
  const projection = {
    name: 1,
    'analysis.inctyper': 1,
  };

  return Genome.find(query, projection)
    .cursor()
    .pipe(csv.transform(transformer))
    .pipe(csv.stringify({ header: true, quotedString: true }))
    .pipe(res);
};
