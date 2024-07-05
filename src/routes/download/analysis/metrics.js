const sanitize = require('sanitize-filename');
const csv = require('csv');
const Genome = require('models/genome');

const { transformer } = require('routes/download/utils/metrics');

module.exports = (req, res) => {
  const { user } = req;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'stats.csv';
  const { ids } = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = Genome.getPrefilterCondition({ user }, { _id: { $in: ids.split(',') }, 'analysis.metrics': { $exists: true } });
  const projection = {
    name: 1,
    'analysis.metrics.__v': 1,
    'analysis.metrics.length': 1,
    'analysis.metrics.contigs': 1,
    'analysis.metrics.smallestContig': 1,
    'analysis.metrics.largestContig': 1,
    'analysis.metrics.averageContig': 1,
    'analysis.metrics.N50': 1,
    'analysis.metrics.nonATCG': 1,
    'analysis.metrics.gcContent': 1,
  };

  return Genome.find(query, projection)
    .cursor()
    .pipe(csv.transform(transformer))
    .pipe(csv.stringify({ header: true, quotedString: true }))
    .pipe(res);
};
