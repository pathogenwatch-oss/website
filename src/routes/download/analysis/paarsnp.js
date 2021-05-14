const csv = require('csv');
const sanitize = require('sanitize-filename');
const Genome = require('models/genome');

const transformer = function (doc) {
  const {__v, library = {version: '0.0.1', source: 'PUBLIC'}} = doc.analysis.paarsnp;
  const result = {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: __v,
    'Library Version': library.source === 'PUBLIC' ? library.version : `${library.source}: ${library.version}`
  };
  for (const { state, agent } of doc.analysis.paarsnp.resistanceProfile) {
    result[agent.name] = state;
  }
  return result;
};

module.exports = (req, res) => {
  const { user } = req;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'amr.csv';
  const { ids } = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = Object.assign(
    { _id: { $in: ids.split(',') }, 'analysis.paarsnp': { $exists: true } },
    Genome.getPrefilterCondition({ user })
  );
  const projection = {
    name: 1,
    'analysis.paarsnp.__v': 1,
    'analysis.paarsnp.library': 1,
    'analysis.paarsnp.resistanceProfile': 1,
  };

  return Genome.find(query, projection)
    .cursor()
    .pipe(csv.transform(transformer))
    .pipe(csv.stringify({ header: true, quotedString: true }))
    .pipe(res);
};
