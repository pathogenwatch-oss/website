module.exports.transformer = function (doc) {
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
