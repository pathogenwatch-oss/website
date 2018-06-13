const sanitize = require('sanitize-filename');
const csv = require('csv');
const Genome = require('models/genome');

const transformer = function (doc, callback) {
  const result = [];
  for (const { gene, id, start, end, contig } of doc.analysis.cgmlst.matches) {
    result.push({
      'Genome ID': doc._id.toString(),
      'Genome Name': doc.name,
      Version: doc.analysis.cgmlst.__v,
      Gene: gene,
      'Allele ID': id,
      Start: start,
      End: end,
      Contig: contig,
      Direction: start > end ? 'reverse' : 'forwards',
    });
  }
  callback(null, ...result);
};

module.exports = (req, res) => {
  const { user, sessionID } = req;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'cgmlst.csv';
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
