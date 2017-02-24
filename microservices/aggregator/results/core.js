const CollectionGenome = require('models/collectionGenome');
const mainStorage = require('services/storage')('main');
const { CORE_RESULT } = require('utils/documentKeys');

module.exports = (name, { assemblyId, documentKeys }) => {
  const { uuid } = assemblyId;
  const resultDocKey = documentKeys.find(_ => _.indexOf(CORE_RESULT) === 0);
  return mainStorage.retrieve(resultDocKey).
    then(result => ({
      size: result.kernelSize,
      percentMatched: result.percentKernelMatched,
      percentAssemblyMatched: result.percentAssemblyMatched,
    })).
    then(result => CollectionGenome.addAnalysisResult(uuid, name, result));
};
