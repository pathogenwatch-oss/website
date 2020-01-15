const sanitize = require('sanitize-filename');
const csv = require('csv');
const Genome = require('models/genome');

const transformer = function (doc) {
  const record = {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    'Version': doc.analysis.spn_pbp_amr.__v,
    'PBP1a': doc.analysis.spn_pbp_amr.pbp1a,
    'PBP2b': doc.analysis.spn_pbp_amr.pbp2b,
    'PBP2x': doc.analysis.spn_pbp_amr.pbp2x,
  };

  Object.keys(doc.analysis.spn_pbp_amr)
    .filter(prop => !prop.match(/^pbp/))
    .filter(prop => prop !== '__v')
    .sort()
    .forEach(prop =>
      (record[prop.replace(/_/g, ' ')] = doc.analysis.spn_pbp_amr[prop])
    );
  return record;
};

module.exports = (req, res) => {
  const { user } = req;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'spn_pbp_amr.csv';
  const { ids } = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = Object.assign(
    { _id: { $in: ids.split(',') }, 'analysis.spn_pbp_amr': { $exists: true } },
    Genome.getPrefilterCondition({ user })
  );
  const projection = {
    name: 1,
    'analysis.spn_pbp_amr': 1,
  };

  return Genome.find(query, projection)
    .cursor()
    .pipe(csv.transform(transformer))
    .pipe(csv.stringify({ header: true, quotedString: true }))
    .pipe(res);
};
