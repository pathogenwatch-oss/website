const CollectionGenome = require('data/collectionGenome');
const Species = require('data/collectionGenome');

exports.storeGenomeAnalysis = function (uuid, speciesId, name, result) {
  return (uuid.startsWith(`${speciesId}_`) ?
    Species.addAnalysisResult(speciesId, uuid, name, result) :
    CollectionGenome.addAnalysisResult(uuid, name, result)
  );
};
