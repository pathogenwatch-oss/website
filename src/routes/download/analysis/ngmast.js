const csv = require('csv');
const Genome = require('models/genome');

const transformer = function (doc) {
  return {
    genomeId: doc._id.toString(),
    genomeName: doc.name,
    version: doc.analysis.ngmast.__v,
    ngmast: doc.analysis.ngmast.ngmast,
    por: doc.analysis.ngmast.por,
    tbpb: doc.analysis.ngmast.tbpb,
  };
};

module.exports = (req, res) => {
  const { user, sessionID } = req;
  const { filename = 'wgsa-ngmast.csv' } = req.query;
  const { ids } = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = Object.assign(
    { _id: { $in: ids.split(',') }, 'analysis.ngmast': { $exists: true } },
    Genome.getPrefilterCondition({ user, sessionID })
  );
  const projection = {
    name: 1,
    'analysis.ngmast.__v': 1,
    'analysis.ngmast.ngmast': 1,
    'analysis.ngmast.por': 1,
    'analysis.ngmast.tbpb': 1,
  };

  return Genome.find(query, projection)
    .cursor()
    .pipe(csv.transform(transformer))
    .pipe(csv.stringify({ header: true, quotedString: true }))
    .pipe(res);
};
