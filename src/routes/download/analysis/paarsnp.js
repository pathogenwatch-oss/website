const csv = require('csv');
const Genome = require('models/genome');

const transformer = function (doc) {
  const result = {
    genomeId: doc._id.toString(),
    genomeName: doc.name,
    version: doc.analysis.paarsnp.__v,
  };
  for (const { state, fullName } of doc.analysis.paarsnp.antibiotics) {
    result[fullName] = state;
  }
  return result;
};

module.exports = (req, res) => {
  const { user, sessionID } = req;
  const { filename = 'wgsa-paarsnp.csv' } = req.query;
  const { ids } = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = Object.assign(
    { _id: { $in: ids.split(',') }, 'analysis.paarsnp': { $exists: true } },
    Genome.getPrefilterCondition({ user, sessionID })
  );
  const projection = {
    name: 1,
    'analysis.paarsnp.__v': 1,
    'analysis.paarsnp.antibiotics': 1,
  };

  return Genome.find(query, projection)
    .cursor()
    .pipe(csv.transform(transformer))
    .pipe(csv.stringify({ header: true, quotedString: true }))
    .pipe(res);
};
