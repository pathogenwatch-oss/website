const sanitize = require('sanitize-filename');
const csv = require('csv');
const Genome = require('models/genome');

const transformer = function (doc) {
  return {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: doc.analysis.ngmast.__v,
    'NG-Mast': doc.analysis.ngmast.ngmast,
    POR: doc.analysis.ngmast.por,
    TBPB: doc.analysis.ngmast.tbpb,
  };
};

module.exports = (req, res) => {
  const { user, sessionID } = req;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'ngmast.csv';
  const { ids } = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = Object.assign(
    { _id: { $in: ids.split(',') }, 'analysis.ngmast': { $exists: true } },
    Genome.getPrefilterCondition({ user, sessionID })
  );
  const projection = {
    name: 1,
    'analysis.ngmast.__v': 1,
    'analysis.ngmast.ngmast': 1,
    'analysis.ngmast.por': 1,
    'analysis.ngmast.tbpb': 1,
  };

  return Genome.find(query, projection)
    .cursor()
    .pipe(csv.transform(transformer))
    .pipe(csv.stringify({ header: true, quotedString: true }))
    .pipe(res);
};
