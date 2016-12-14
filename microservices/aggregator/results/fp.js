const CollectionGenome = require('data/collectionGenome');
const mainStorage = require('services/storage')('main');
const { FP_RESULT, ASSEMBLY_METADATA } = require('utils/documentKeys');

function getReferenceDisplayName({ subTypeAssignment }) {
  return mainStorage.retrieve(`${ASSEMBLY_METADATA}_${subTypeAssignment}`).
    then(({ name }) => ({
      subtype: name,
      uuid: subTypeAssignment,
    }));
}

module.exports = (name, { assemblyId }) => {
  const { uuid } = assemblyId;
  return mainStorage.retrieve(`${FP_RESULT}_${uuid}`).
    then(getReferenceDisplayName).
    then(result => CollectionGenome.addAnalysisResult(uuid, name, result));
};
