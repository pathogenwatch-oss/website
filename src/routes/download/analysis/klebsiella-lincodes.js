const sanitize = require('sanitize-filename');
const csv = require('csv');
const Genome = require('models/genome');

const transformer = function (doc) {
  const result = doc.analysis['klebsiella-lincodes'];
  return {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: result.__v,
    'cgST': result.cgST,
    'Closest cgST': result['Closest cgST'],
    'LIN code': result.LINcode.join(','),
    Sublineage: result.Sublineage,
    'Clonal Group': result['Clonal Group'],
    Identity: result.identity,
    Identical: result.identical,
    'Compared Loci Count': result.comparedLoci,
    'Closest profile(s)': result
      .matches
      .map(match => `cgST:${match.st} LIN code:${match.LINcode}`)
      .join(';'),
  };
};

module.exports = (req, res) => {
  const { user } = req;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'cgmlst_classification.csv';
  const { ids } = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = {
    _id: { $in: ids.split(',') },
    'analysis.klebsiella-lincodes': { $exists: true },
    ...Genome.getPrefilterCondition({ user }),
  };
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
