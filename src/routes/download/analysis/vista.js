const sanitize = require('sanitize-filename');
const csv = require('csv');
const Genome = require('models/genome');

const { transformer } = require('../utils/vista-full');

module.exports = (req, res) => {
  const { user } = req;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'vista.csv';
  const { ids } = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = Genome.getPrefilterCondition({ user }, { _id: { $in: ids.split(',') }, 'analysis.vista': { $exists: true } });
  const projection = {
    name: 1,
    'analysis.vista': 1,
  };

  return Genome.find(query, projection)
    .cursor()
    .pipe(csv.transform(transformer))
    .pipe(csv.stringify({ header: true, quotedString: true }))
    .pipe(res);
};
