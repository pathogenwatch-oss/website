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

module.exports = (name, { assemblyId, speciesId, documentKeys }) => {
  const { uuid } = assemblyId;
  const resultDocKey = documentKeys.find(_ => _.indexOf(FP_RESULT) === 0);
  return Promise.all([
    mainStorage.retrieve(resultDocKey),
    Species.getLatest(speciesId),
  ]).
    then(formatResult).
    then(result => CollectionGenome.addAnalysisResult(uuid, name, result));
};
