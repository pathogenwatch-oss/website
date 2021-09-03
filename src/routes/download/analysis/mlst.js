const sanitize = require('sanitize-filename');
const csv = require('csv');
const Genome = require('models/genome');

const transformer = (key) => (doc) => {
  const result = {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: doc.analysis[key].__v,
    ST: doc.analysis[key].st,
  };

  for (const { gene, hits } of doc.analysis[key].alleles) {
    result[gene] = hits.join(',');
  }

  return result;
};

module.exports = (key) => (req, res) => {
  const { user } = req;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || `${key}.csv`;
  const { ids } = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = {
    _id: { $in: ids.split(',') },
    [`analysis.${key}`]: { $exists: true },
    ...Genome.getPrefilterCondition({ user }),
  };
  const projection = {
    name: 1,
    [`analysis.${key}.__v`]: 1,
    [`analysis.${key}.st`]: 1,
    [`analysis.${key}.alleles`]: 1,
  };

  return Genome.find(query, projection)
    .cursor()
    .pipe(csv.transform(transformer(key)))
    .pipe(csv.stringify({ header: true, quotedString: true }))
    .pipe(res);
};
