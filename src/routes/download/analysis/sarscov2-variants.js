const sanitize = require('sanitize-filename');
const csv = require('csv');
const Genome = require('models/genome');

const transformer = function (doc) {
  const record = {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: doc.analysis['sarscov2-variants'].__v,
  };

  doc.analysis["sarscov2-variants"].variants
    .sort((a, b) => {
      if (a.type === b.type) {
        if (a.name < b.name) {
          return -1;
        }
        return 1;
      } else if (a.type === 'Deletion' || a.type === 'SNP') {
        if (a.type === 'SNP') {
          return 1;
        } else if (b.type === 'SNP') {
          return -1;
        }
        return 1;
      }
      return -1;
    })
    .forEach((variant) => {
      record[variant.name] = variant.state === 'other' ? `${variant.state} (${variant.found})` : variant.state;
    });
  return record;
};

module.exports = (req, res) => {
  const { user } = req;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'sars-cov-2-variants.csv';
  const { ids } = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = {
    _id: { $in: ids.split(',') },
    'analysis.sarscov2-variants': { $exists: true },
    ...Genome.getPrefilterCondition({ user }),
  };

  const projection = {
    name: 1,
    'analysis.sarscov2-variants': 1,
  };

  return Genome.find(query, projection)
    .cursor()
    .pipe(csv.transform(transformer))
    .pipe(csv.stringify({ header: true, quotedString: true }))
    .pipe(res);
};
