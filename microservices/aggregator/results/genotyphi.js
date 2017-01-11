const { storeGenomeAnalysis } = require('../utils');
const mainStorage = require('services/storage')('main');
const { GENOTYPHI_RESULT } = require('utils/documentKeys');

module.exports = (name, { assemblyId, speciesId }) => {
  const { uuid } = assemblyId;
  return mainStorage.retrieve(`${GENOTYPHI_RESULT}_${uuid}`).
    then(result => ({
      genotype: result.genotype,
    })).
    then(result =>
      storeGenomeAnalysis(uuid, speciesId, name, result)
    );
};
