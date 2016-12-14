const CollectionGenome = require('data/collectionGenome');
const mainStorage = require('services/storage')('main');
const { GENOTYPHI_RESULT } = require('utils/documentKeys');

module.exports = (name, { assemblyId }) => {
  const { uuid } = assemblyId;
  return mainStorage.retrieve(`${GENOTYPHI_RESULT}_${uuid}`).
    then(result => ({
      genotype: result.genotype,
    })).
    then(result => CollectionGenome.addAnalysisResult(uuid, name, result));
};
