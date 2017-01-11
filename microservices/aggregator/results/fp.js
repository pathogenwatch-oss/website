const { storeGenomeAnalysis } = require('../utils');
const mainStorage = require('services/storage')('main');
const { FP_RESULT } = require('utils/documentKeys');

function formatResult({ subTypeAssignment }) {
  return {
    subtype: subTypeAssignment,
  };
}

module.exports = (name, { assemblyId, speciesId }) => {
  const { uuid } = assemblyId;
  return mainStorage.retrieve(`${FP_RESULT}_${uuid}`).
    then(formatResult).
    then(result =>
      storeGenomeAnalysis(uuid, speciesId, name, result)
    );
};
