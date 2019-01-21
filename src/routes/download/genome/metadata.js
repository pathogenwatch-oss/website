const sanitize = require('sanitize-filename');
const csv = require('csv');
const Genome = require('models/genome');

const transformer = function (doc) {
  const result = {
    Id: doc._id.toString(),
    Name: doc.name,
    Filename: doc.filename,
    Latitude: doc.latitude,
    Longitude: doc.longitude,
    Day: doc.day,
    Month: doc.month,
    Year: doc.year,
    PMID: doc.pmid,
  };

  for (const [ key, value ] of Object.entries(doc.userDefined)) {
    result[`${key[0].toUpperCase()}${key.slice(1)}`] = value;
  }

  return result;
};

module.exports = (req, res) => {
  const { user } = req;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'mlst.csv';
  const { ids } = req.body;

  if (!ids || !ids.length) return res.sendStatus(400);

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = Object.assign(
    { _id: { $in: ids.split(',') }, 'analysis.mlst': { $exists: true } },
    Genome.getPrefilterCondition({ user })
  );
  const projection = {
    country: 1,
    day: 1,
    filename: 1,
    latitude: 1,
    longitude: 1,
    month: 1,
    name: 1,
    pmid: 1,
    uploadedAt: 1,
    year: 1,
    userDefined: 1,
  };

  return Genome.find(query, projection)
    .cursor()
    .pipe(csv.transform(transformer))
    .pipe(csv.stringify({ header: true, quotedString: true }))
    .pipe(res);
};
