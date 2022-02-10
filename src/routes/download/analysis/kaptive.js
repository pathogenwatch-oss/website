const sanitize = require('sanitize-filename');
const csv = require('csv');
const Genome = require('models/genome');

const transformer = (doc) => {
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

module.exports = (req, res) => {
  const { user } = req;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'kaptive.csv';
  const { ids } = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = {
    _id: { $in: ids.split(',') },
    'analysis.kaptive': { $exists: true },
    ...Genome.getPrefilterCondition({ user }),
  };
  const projection = {
    name: 1,
    'analysis.kaptive': 1,
  };

  return Genome.find(query, projection)
    .cursor()
    .pipe(csv.transform(transformer))
    .pipe(csv.stringify({ header: true, quotedString: true }))
    .pipe(res);
};
