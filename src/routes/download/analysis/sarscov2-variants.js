const sanitize = require('sanitize-filename');
const csv = require('csv');
const Genome = require('models/genome');
const { transformer } = require('../utils/sarscov2-variants');

module.exports = (req, res) => {
  const { user } = req;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'sars-cov-2-variants.csv';
  const { ids } = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = {
    _id: { $in: ids.split(',') },
    'analysis.sarscov2-variants': { $exists: true },
    ...Genome.getPrefilterCondition({ user }),
  };

  const projection = {
    name: 1,
    'analysis.sarscov2-variants': 1,
  };

  return Genome.find(query, projection)
    .cursor()
    .pipe(csv.transform(transformer))
    .pipe(csv.stringify({ header: true, quotedString: true }))
    .pipe(res);
};
