const sanitize = require('sanitize-filename');
const csv = require('csv');
const Genome = require('models/genome');

const { transformer } = require('routes/download/utils/klebsiella-lincodes');

module.exports = (req, res) => {
  const { user } = req;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'cgmlst_classification.csv';
  const { ids } = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = Genome.getPrefilterCondition({ user }, { _id: { $in: ids.split(',') }, 'analysis.klebsiella-lincodes': { $exists: true } });
  const projection = {
    name: 1,
    'analysis.klebsiella-lincodes': 1,
  };

  return Genome.find(query, projection)
    .cursor()
    .pipe(csv.transform(transformer))
    .pipe(csv.stringify({ header: true, quotedString: true }))
    .pipe(res);
};
