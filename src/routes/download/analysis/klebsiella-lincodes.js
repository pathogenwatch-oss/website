const sanitize = require('sanitize-filename');
const csv = require('csv');
const Genome = require('models/genome');

const transformer = function (doc) {
  return {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: doc.analysis['klebsiella-lincodes'].__v,
    cgST: doc.analysis['klebsiella-lincodes'].cgST,
    LINcode: doc.analysis['klebsiella-lincodes'].LINcode,
    'Clonal Group': doc.analysis['klebsiella-lincodes']['Clonal Group'],
    Sublineage: doc.analysis['klebsiella-lincodes'].Sublineage,
    'Reference profile mismatches': doc.analysis['klebsiella-lincodes'].mismatches,
    'Closest profile(s)': doc.analysis['klebsiella-lincodes']
      .matches
      .map(match => `cgST:${match.cgST} LINcode:${match.LINcode}`)
      .join(', '),
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
