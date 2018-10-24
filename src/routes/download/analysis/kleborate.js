const sanitize = require('sanitize-filename');
const csv = require('csv');
const Genome = require('models/genome');

const transformer = function (doc) {
  const record = {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
  };

  Object.keys(doc.analysis.kleborate)
      .forEach(prop =>
          record[prop.replace('__v', 'Version').replace(/_/g, ' ')] = doc.analysis.kleborate[prop]
      );
  return record;
};

module.exports = (req, res) => {
  const {user} = req;
  const {filename: rawFilename = ''} = req.query;
  const filename = sanitize(rawFilename) || 'kleborate.csv';
  const {ids} = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = Object.assign(
      {_id: {$in: ids.split(',')}, 'analysis.kleborate': {$exists: true}},
      Genome.getPrefilterCondition({user})
  );
  const projection = {
    name: 1,
    'analysis.kleborate': 1,
  };

  return Genome.find(query, projection)
      .cursor()
      .pipe(csv.transform(transformer))
      .pipe(csv.stringify({header: true, quotedString: true}))
      .pipe(res);
};

