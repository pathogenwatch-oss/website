const sanitize = require('sanitize-filename');
const csv = require('csv');
const Genome = require('models/genome');
const Analysis = require('models/analysis');

const transformer = (versions) => (doc, callback) => {
  const result = [];
  const { fileId, version, results: cgmlst } = doc;
  const genomes = (versions[fileId] || {})[version] || [];
  for (const { _id, name } of genomes) {
    for (const { gene, id, start, end, contig } of cgmlst.matches) {
      result.push({
        'Genome ID': _id.toString(),
        'Genome Name': name,
        Version: version,
        Gene: gene,
        'Allele ID': id,
        Start: start,
        End: end,
        Contig: contig,
        Direction: start > end ? 'reverse' : 'forwards',
      });
    }
  }
  callback(null, ...result);
};

module.exports = async (req, res) => {
  const { user } = req;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'cgmlst.csv';
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
  const versions = genomeDetails.reduce((acc, details) => {
    const version = details.analysis.cgmlst.__v;
    const { fileId } = details;
    acc[fileId] = acc[fileId] || {};
    acc[fileId][version] = acc[fileId][version] || [];
    acc[fileId][version].push(details);
    return acc;
  }, {});
  const fileIds = Object.keys(versions);

  const analysisQuery = {
    fileId: { $in: fileIds },
    task: 'cgmlst',
  };

  return Analysis.find(analysisQuery)
    .cursor()
    .pipe(csv.transform(transformer(versions)))
    .pipe(csv.stringify({ header: true, quotedString: true }))
    .pipe(res);
};
