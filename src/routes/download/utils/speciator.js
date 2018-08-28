module.exports.transformer = function (doc) {
  return {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: doc.analysis.speciator.__v,
    'Organism Name': doc.analysis.speciator.organismName,
    'Organism ID': doc.analysis.speciator.organismId,
    'Species Name': doc.analysis.speciator.speciesName,
    'Species ID': doc.analysis.speciator.speciesId,
    'Genus Name': doc.analysis.speciator.genusName,
    'Genus ID': doc.analysis.speciator.genusId,
    'Reference ID': doc.analysis.speciator.referenceId,
    'Matching Hashes': doc.analysis.speciator.matchingHashes,
    'p-Value': doc.analysis.speciator.pValue,
    'Mash Distance': doc.analysis.speciator.mashDistance,
  };
};
