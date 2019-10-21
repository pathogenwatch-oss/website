const sanitize = require('sanitize-filename');
const csv = require('csv');
const Genome = require('models/genome');
const Analysis = require('models/analysis');
const { NotFoundError } = require('utils/errors');

const transformer = (versions) => (doc, callback) => {
  const result = [];
  const { fileId, version, results: cgmlst } = doc;
  const genomes = (versions[fileId] || {})[version] || [];
  for (const { _id, name } of genomes) {
    const row = {
      'Genome ID': _id.toString(),
      'Genome Name': name,
      Version: version,
    };
    for (const { gene, id } of cgmlst.matches) {
      row[gene] = id;
    }
    result.push(row);
  }
  callback(null, ...result);
};

const standardColumns = [
  'Genome ID',
  'Genome Name',
  'Version',
];

module.exports = async (req, res, next) => {
  const { user } = req;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'cgmlst-profile.csv';
  const { ids } = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = Object.assign(
    { _id: { $in: ids.split(',') }, 'analysis.cgmlst': { $exists: true } },
    Genome.getPrefilterCondition({ user })
  );

  const projection = {
    name: 1,
    'analysis.cgmlst.__v': 1,
    fileId: 1,
  };

  const genomeDetails = await Genome.find(query, projection).lean();

  if (genomeDetails.length === 0) {
    return next(new NotFoundError('Query did not return any results'));
  }

  const $or = [];
  const versions = genomeDetails.reduce((acc, details) => {
    const version = details.analysis.cgmlst.__v;
    const { fileId } = details;
    acc[fileId] = acc[fileId] || {};
    acc[fileId][version] = acc[fileId][version] || [];
    acc[fileId][version].push(details);

    $or.push({ fileId, version });

    return acc;
  }, {});

  const analysisQuery = {
    $or,
    task: 'cgmlst',
  };

  const genes = await Analysis.distinct('results.matches.gene', analysisQuery);
  genes.sort();
  const columns = [ ...standardColumns, ...genes ];

  return Analysis.find(analysisQuery)
    .cursor()
    .pipe(csv.transform(transformer(versions)))
    .pipe(csv.stringify({ header: true, quotedString: true, columns }))
    .pipe(res);
};
