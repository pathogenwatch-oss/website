const sanitize = require('sanitize-filename');
const csv = require('csv');
const Genome = require('models/genome');
const { labels, transformer } = require('../utils/serotype');

module.exports = (req, res) => {
  const { user } = req;
  const { filename: rawFilename = '', speciesId } = req.query;
  const filename = sanitize(rawFilename) || 'serotype.csv';
  const { ids } = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = {
    _id: { $in: ids.split(',') },
    'analysis.serotype': { $exists: true },
    ...Genome.getPrefilterCondition({ user }),
  };
  const projection = {
    name: 1,
    'analysis.serotype': 1,
  };

  return Genome.find(query, projection)
    .cursor()
    .pipe(csv.transform(transformer(labels[speciesId] || labels.general)))
    .pipe(csv.stringify({ header: true, quotedString: true }))
    .pipe(res);
};
