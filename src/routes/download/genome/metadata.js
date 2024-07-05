const sanitize = require('sanitize-filename');
const csv = require('csv');
const { ObjectId } = require('mongoose').Types;
const { asyncWrapper } = require('utils/routes');

const Genome = require('models/genome');

const { transformer, standardColumns } = require('../utils/metadata');

module.exports = asyncWrapper(async (req, res, next) => {
  const { user } = req;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'metadata.csv';
  const { ids } = req.body;

  if (!ids || !ids.length) return res.sendStatus(400);

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = Genome.getPrefilterCondition({ user }, { _id: { $in: ids.split(',').map((id) => new ObjectId(id)) } });
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
