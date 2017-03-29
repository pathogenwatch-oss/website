const CollectionGenome = require('models/collectionGenome');
const mainStorage = require('services/storage')('main');
const { CORE_RESULT } = require('utils/documentKeys');

module.exports = (name, { assemblyId }) => {
  const { uuid } = assemblyId;
  return mainStorage.retrieve(`${CORE_RESULT}_${uuid}`).
    then(result => ({
      size: result.kernelSize,
      percentMatched: result.percentKernelMatched,
      percentAssemblyMatched: result.percentAssemblyMatched,
    })).
    then(result => CollectionGenome.addAnalysisResult(uuid, name, result));
};
