const CollectionGenome = require('models/collectionGenome');
const Species = require('models/species');
const mainStorage = require('services/storage')('main');
const { FP_RESULT } = require('utils/documentKeys');

function formatResult([ { subTypeAssignment }, { references } ]) {
  const reference = references.find(_ => _.uuid === subTypeAssignment);
  return {
    subtype: subTypeAssignment,
    referenceName: reference ? reference.name : subTypeAssignment,
  };
}

module.exports = (name, { assemblyId, speciesId }) => {
  const { uuid } = assemblyId;
  return Promise.all([
    mainStorage.retrieve(`${FP_RESULT}_${uuid}`),
    Species.getLatest(speciesId),
  ]).
    then(formatResult).
    then(result => CollectionGenome.addAnalysisResult(uuid, name, result));
};
