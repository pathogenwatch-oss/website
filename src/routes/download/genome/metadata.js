const sanitize = require('sanitize-filename');
const csv = require('csv');
const { ObjectId } = require('mongoose').Types;
const { asyncWrapper } = require('utils/routes');

const Genome = require('models/genome');

const standardColumns = [
  'id',
  'displayname',
  'latitude',
  'longitude',
  'day',
  'month',
  'year',
  'literaturelink',
];

const transformer = function (doc) {
  const result = {
    id: doc._id.toString(),
    displayname: doc.name,
    latitude: doc.latitude,
    longitude: doc.longitude,
    day: doc.day,
    month: doc.month,
    year: doc.year,
    literaturelink: doc.literatureLink.value,
  };

  if (doc.userDefined) {
    for (const [ key, value ] of Object.entries(doc.userDefined)) {
      result[key] = value;
    }
  }

  return result;
};

module.exports = asyncWrapper(async (req, res, next) => {
  const { user } = req;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'metadata.csv';
  const { ids } = req.body;

  if (!ids || !ids.length) return res.sendStatus(400);

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = {
    _id: { $in: ids.split(',').map((id) => new ObjectId(id)) },
    ...Genome.getPrefilterCondition({ user }),
  };
  const projection = {
    country: 1,
    day: 1,
    latitude: 1,
    longitude: 1,
    month: 1,
    name: 1,
    literatureLink: 1,
    uploadedAt: 1,
    userDefined: 1,
    year: 1,
  };

  // retrieve all user-defined columns
  const result = await Genome.aggregate([
    { $match: query },
    { $project: { userDefined: { $objectToArray: '$userDefined' } } },
    { $unwind: { path: '$userDefined', preserveNullAndEmptyArrays: true } },
    { $group: { _id: null, columns: { $addToSet: '$userDefined.k' } } },
  ]);

  if (result.length === 0) {
    return res.sendStatus(400);
  }

  const columns = [ ...standardColumns, ...result[0].columns ];

  return Genome.find(query, projection, { sort: { name: 1 } })
    .cursor()
    .pipe(csv.transform(transformer))
    .pipe(csv.stringify({ header: true, quotedString: true, columns }))
    .pipe(res);
});
