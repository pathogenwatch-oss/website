const csv = require('csv');
const Genome = require('models/genome');

const transformer = function (doc) {
  return {
    genomeId: doc._id.toString(),
    genomeName: doc.name,
    version: doc.analysis.speciator.__v,
    organismName: doc.analysis.speciator.organismName,
    organismId: doc.analysis.speciator.organismId,
    speciesName: doc.analysis.speciator.speciesName,
    speciesId: doc.analysis.speciator.speciesId,
    genusName: doc.analysis.speciator.genusName,
    genusId: doc.analysis.speciator.genusId,
    referenceId: doc.analysis.speciator.referenceId,
    matchingHashes: doc.analysis.speciator.matchingHashes,
    pValue: doc.analysis.speciator.pValue,
    mashDistance: doc.analysis.speciator.mashDistance,
  };
};

module.exports = (req, res) => {
  const { user, sessionID } = req;
  const { filename = 'wgsa-speciator.csv' } = req.query;
  const { ids } = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = Object.assign(
    { _id: { $in: ids.split(',') }, 'analysis.speciator': { $exists: true } },
    Genome.getPrefilterCondition({ user, sessionID })
  );
  const projection = {
    name: 1,
    'analysis.speciator': 1,
  };

  return Genome.find(query, projection)
    .cursor()
    .pipe(csv.transform(transformer))
    .pipe(csv.stringify({ header: true, quotedString: true }))
    .pipe(res);
};
