const CollectionAssembly = require('data/collectionAssembly');
const mainStorage = require('services/storage')('main');
const { FP_RESULT } = require('utils/documentKeys');

module.exports = (name, { assemblyId }) => {
  const { uuid } = assemblyId;
  return mainStorage.retrieve(`${FP_RESULT}_${uuid}`).
    then(result => ({
      subtype: result.subTypeAssignment,
    })).
    then(result => CollectionAssembly.addAnalysisResult(uuid, name, result));
};
