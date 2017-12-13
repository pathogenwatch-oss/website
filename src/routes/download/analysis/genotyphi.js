const csv = require('csv');
const Genome = require('models/genome');

const transformer = function (doc) {
  return {
    genomeId: doc._id.toString(),
    genomeName: doc.name,
    version: doc.analysis.genotyphi.__v,
    genotype: doc.analysis.genotyphi.genotype,
    snpsCalled: doc.analysis.genotyphi.foundLoci,
  };
};

module.exports = (req, res) => {
  const { user, sessionID } = req;
  const { filename = 'wgsa-genotyphi.csv' } = req.query;
  const { ids } = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = Object.assign(
    { _id: { $in: ids.split(',') }, 'analysis.genotyphi': { $exists: true } },
    Genome.getPrefilterCondition({ user, sessionID })
  );
  const projection = {
    name: 1,
    'analysis.genotyphi.__v': 1,
    'analysis.genotyphi.genotype': 1,
    'analysis.genotyphi.foundLoci': 1,
  };

  return Genome.find(query, projection)
    .cursor()
    .pipe(csv.transform(transformer))
    .pipe(csv.stringify({ header: true, quotedString: true }))
    .pipe(res);
};
