const CollectionAssembly = require('data/collectionAssembly');
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
    then(result => CollectionAssembly.addAnalysisResult(uuid, name, result));
};
