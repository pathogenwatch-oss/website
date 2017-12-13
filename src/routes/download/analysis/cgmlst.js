const csv = require('csv');
const Genome = require('models/genome');

const transformer = function (doc, callback) {
  const result = [];
  for (const { gene, id, start, end, contig } of doc.analysis.cgmlst.matches) {
    result.push({
      genomeId: doc._id.toString(),
      genomeName: doc.name,
      version: doc.analysis.cgmlst.__v,
      gene,
      alleleId: id,
      start,
      end,
      contig,
      direction: start > end ? 'reverse' : 'forwards',
    });
  }
  callback(null, ...result);
};

module.exports = (req, res) => {
  const { user, sessionID } = req;
  const { filename = 'wgsa-cgmlst.csv' } = req.query;
  const { ids } = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = Object.assign(
    { _id: { $in: ids.split(',') }, 'analysis.cgmlst': { $exists: true } },
    Genome.getPrefilterCondition({ user, sessionID })
  );
  const projection = {
    name: 1,
    'analysis.cgmlst.__v': 1,
    'analysis.cgmlst.st': 1,
    'analysis.cgmlst.matches': 1,
  };
  return Genome.find(query, projection)
    .cursor()
    .pipe(csv.transform(transformer))
    .pipe(csv.stringify({ header: true, quotedString: true }))
    .pipe(res);
};
