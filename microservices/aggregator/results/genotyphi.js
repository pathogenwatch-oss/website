const CollectionAssembly = require('data/collectionAssembly');
const mainStorage = require('services/storage')('main');
const { GENOTYPHI_RESULT } = require('utils/documentKeys');

module.exports = (name, { assemblyId }) => {
  const { uuid } = assemblyId;
  return mainStorage.retrieve(`${GENOTYPHI_RESULT}_${uuid}`).
    then(result => ({
      genotype: result.genotype,
    })).
    then(result => CollectionAssembly.addAnalysisResult(uuid, name, result));
};
