const CollectionGenome = require('models/collectionGenome');
const mainStorage = require('services/storage')('main');
const { GENOTYPHI_RESULT } = require('utils/documentKeys');

module.exports = (name, { assemblyId, documentKeys }) => {
  const { uuid } = assemblyId;
  const resultDocKey = documentKeys.find(_ => _.indexOf(GENOTYPHI_RESULT) === 0);
  return mainStorage.retrieve(resultDocKey).
    then(result => ({
      genotype: result.genotype,
      snps: result.genotyphiMutations ?
        result.genotyphiMutations.length : undefined,
      foundLoci: result.foundLoci,
    })).
    then(result => CollectionGenome.addAnalysisResult(uuid, name, result));
};
