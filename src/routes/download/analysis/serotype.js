const sanitize = require('sanitize-filename');
const csv = require('csv');
const Genome = require('models/genome');

const subspeciesKey = 'subspecies';
const transformer = function (doc, label) {
  const row = {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: doc.analysis.serotype.__v,
    [label]: doc.analysis.serotype.value,
  };
  if (subspeciesKey in doc.analysis.serotype) {
    row.Subspecies = doc.analysis.serotype[subspeciesKey];
  }
  return row;
};

const labels = {
  580: 'Serovar',
  general: 'Serotype',
};

module.exports = (req, res) => {
  const { user } = req;
  const { filename: rawFilename = '', speciesId } = req.query;
  const filename = sanitize(rawFilename) || 'serotype.csv';
  const { ids } = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = Object.assign(
    { _id: { $in: ids.split(',') }, 'analysis.serotype': { $exists: true } },
    Genome.getPrefilterCondition({ user })
  );
  const projection = {
    name: 1,
    'analysis.serotype': 1,
  };

  const transform = doc => transformer(doc, labels[speciesId] || labels.general);

  return Genome.find(query, projection)
    .cursor()
    .pipe(csv.transform(transform))
    .pipe(csv.stringify({ header: true, quotedString: true }))
    .pipe(res);
};
