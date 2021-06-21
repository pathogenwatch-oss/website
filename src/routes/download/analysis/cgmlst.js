const sanitize = require('sanitize-filename');
const csv = require('csv');
const Genome = require('models/genome');
const store = require('utils/object-store');

const { Readable } = require('stream');

module.exports = async (req, res) => {
  const { user } = req;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'cgmlst.csv';
  const { ids } = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = {
    _id: { $in: ids.split(',') },
    'analysis.cgmlst': { $exists: true },
    ...Genome.getPrefilterCondition({ user }),
  };

  const projection = {
    name: 1,
    'analysis.cgmlst.__v': 1,
    'analysis.speciator.organismId': 1,
    fileId: 1,
  };

  const genomeDetails = await Genome.find(query, projection).lean();
  const organismIds = [];
  const analysisKeys = [];
  const versions = {};
  for (const details of genomeDetails) {
    const organismId = details.analysis.speciator.organismId;
    organismIds.push(organismId);
    const version = details.analysis.cgmlst.__v;
    const { fileId } = details;
    analysisKeys.push(store.analysisKey('cgmlst', version, fileId, organismId));
    versions[fileId] = versions[fileId] || {};
    versions[fileId][version] = versions[fileId][version] || [];
    versions[fileId][version].push(details);
  }

  async function* generate() {
    for await (const value of store.iterGet(analysisKeys)) {
      const doc = JSON.parse(value);
      if (!organismIds.includes(doc.organismId)) continue;

      const { fileId, version, results: cgmlst } = doc;
      for (const { _id, name } of versions[fileId][version]) {
        for (const { gene, id, start, end, contig } of cgmlst.matches) {
          yield {
            'Genome ID': _id.toString(),
            'Genome Name': name,
            Version: version,
            Gene: gene,
            'Allele ID': id,
            Start: start,
            End: end,
            Contig: contig,
            Direction: start > end ? 'reverse' : 'forwards',
          };
        }
      }
      versions[fileId][version] = [];
    }
  }

  return Readable.from(generate())
    .pipe(csv.stringify({ header: true, quotedString: true }))
    .pipe(res);
};
