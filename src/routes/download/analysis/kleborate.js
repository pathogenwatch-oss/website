const sanitize = require('sanitize-filename');
const csv = require('csv');
const Genome = require('models/genome');

const { transformer } = require('routes/download/utils/kleborate');

module.exports = (req, res) => {
  const { user } = req;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'kleborate.csv';
  const { ids } = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = Genome.getPrefilterCondition({ user }, { _id: { $in: ids.split(',') }, 'analysis.kleborate': { $exists: true } });
  const projection = {
    name: 1,
    'analysis.kleborate': 1,
  };

  return Genome.find(query, projection)
    .cursor()
    .pipe(csv.transform(transformer))
    .pipe(csv.stringify({ bom: true, header: true, quotedString: true }))
    .pipe(res);
};
