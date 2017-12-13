const csv = require('csv');
const Genome = require('models/genome');

const transformer = function (doc) {
  const result = {
    genomeId: doc._id.toString(),
    genomeName: doc.name,
    version: doc.analysis.mlst.__v,
    st: doc.analysis.mlst.st,
  };

  for (const { gene, hits } of doc.analysis.mlst.alleles) {
    result[gene] = hits.join(',');
  }

  return result;
};

module.exports = (req, res) => {
  const { user, sessionID } = req;
  const { filename = 'wgsa-mlst.csv' } = req.query;
  const { ids } = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = Object.assign(
    { _id: { $in: ids.split(',') }, 'analysis.mlst': { $exists: true } },
    Genome.getPrefilterCondition({ user, sessionID })
  );
  const projection = {
    name: 1,
    'analysis.mlst.__v': 1,
    'analysis.mlst.st': 1,
    'analysis.mlst.alleles': 1,
  };

  return Genome.find(query, projection)
    .cursor()
    .pipe(csv.transform(transformer))
    .pipe(csv.stringify({ header: true, quotedString: true }))
    .pipe(res);
};
