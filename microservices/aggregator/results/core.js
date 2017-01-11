const { storeGenomeAnalysis } = require('../utils');
const mainStorage = require('services/storage')('main');
const { CORE_RESULT } = require('utils/documentKeys');

module.exports = (name, { assemblyId, speciesId }) => {
  const { uuid } = assemblyId;
  return mainStorage.retrieve(`${CORE_RESULT}_${uuid}`).
    then(result => ({
      size: result.kernelSize,
      percentMatched: result.percentKernelMatched,
      percentAssemblyMatched: result.percentAssemblyMatched,
    })).
    then(result =>
      storeGenomeAnalysis(assemblyId, speciesId, name, result)
    );
};
