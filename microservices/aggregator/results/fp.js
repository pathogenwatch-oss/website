const CollectionGenome = require('models/collectionGenome');
const mainStorage = require('services/storage')('main');
const { FP_RESULT } = require('utils/documentKeys');

function formatResult({ subTypeAssignment }) {
  return {
    subtype: subTypeAssignment,
  };
}

module.exports = (name, { assemblyId }) => {
  const { uuid } = assemblyId;
  return mainStorage.retrieve(`${FP_RESULT}_${uuid}`).
    then(formatResult).
    then(result => CollectionGenome.addAnalysisResult(uuid, name, result));
};
