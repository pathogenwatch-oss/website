const sanitize = require('sanitize-filename');
const csv = require('csv');
const Genome = require('models/genome');

const transformer = function (doc) {
  return {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: doc.analysis.metrics.__v,
    'Genome Length': doc.analysis.metrics.length,
    'No. Contigs': doc.analysis.metrics.contigs,
    'Smallest Contig': doc.analysis.metrics.smallestContig,
    'Largest Contig': doc.analysis.metrics.largestContig,
    'Average Contig Length': doc.analysis.metrics.averageContig,
    N50: doc.analysis.metrics.N50,
    'non-ATCG': doc.analysis.metrics.nonATCG,
    'GC Content': doc.analysis.metrics.gcContent,
  };
};

module.exports = (req, res) => {
  const { user, sessionID } = req;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'stats.csv';
  const { ids } = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = Object.assign(
    { _id: { $in: ids.split(',') }, 'analysis.metrics': { $exists: true } },
    Genome.getPrefilterCondition({ user, sessionID })
  );
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
