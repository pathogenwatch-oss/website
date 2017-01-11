const { storeGenomeAnalysis } = require('../utils');
const mainStorage = require('services/storage')('main');
const { NGMAST_RESULT } = require('utils/documentKeys');

module.exports = (name, { assemblyId, speciesId }) => {
  const { uuid } = assemblyId;
  return mainStorage.retrieve(`${NGMAST_RESULT}_${uuid}`).
    then(result => ({
      ngmast: result.ngmast,
      por: result.por,
      tbpb: result.tbpb,
    })).
    then(result =>
      storeGenomeAnalysis(assemblyId, speciesId, name, result)
    );
};
