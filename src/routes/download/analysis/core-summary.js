const sanitize = require('sanitize-filename');
const csv = require('csv');
const Genome = require('models/genome');

const transformer = function (doc) {
  return {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: doc.analysis.core.__v,
    'Species Identifier': doc.analysis.core.summary.speciesId,
    'No. Matched Families': doc.analysis.core.summary.familiesMatched,
    'No. Complete Alleles': doc.analysis.core.summary.completeAlleles,
    'Kernel Size (nts)': doc.analysis.core.summary.kernelSize,
    '% Kernel Matched': doc.analysis.core.summary.percentKernelMatched,
    'Pathogenwatch Reference': doc.analysis.core.fp.reference,
  };
};

module.exports = (req, res) => {
  const { user } = req;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'core_stats.csv';
  const { ids } = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = Object.assign(
    { _id: { $in: ids.split(',') }, 'analysis.core': { $exists: true } },
    Genome.getPrefilterCondition({ user })
  );
  const projection = {
    name: 1,
    'analysis.core.__v': 1,
    'analysis.core.summary': 1,
    'analysis.core.fp': 1,
  };

  return Genome.find(query, projection)
    .cursor()
    .pipe(csv.transform(transformer))
    .pipe(csv.stringify({ header: true, quotedString: true }))
    .pipe(res);
};
