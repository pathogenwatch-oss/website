const CollectionGenome = require('models/collectionGenome');
const mainStorage = require('services/storage')('main');
const { GENOTYPHI_RESULT } = require('utils/documentKeys');

module.exports = (name, { assemblyId }) => {
  const { uuid } = assemblyId;
  return mainStorage.retrieve(`${GENOTYPHI_RESULT}_${uuid}`).
    then(result => ({
      genotype: result.genotype,
      snps: result.genotyphiMutations ?
        result.genotyphiMutations.length : undefined,
      foundLoci: result.foundLoci,
    })).
    then(result => CollectionGenome.addAnalysisResult(uuid, name, result));
};
