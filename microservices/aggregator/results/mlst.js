const { storeGenomeAnalysis } = require('../utils');

const mainStorage = require('services/storage')('main');
const sequencesStorage = require('services/storage')('sequences');

const LOGGER = require('utils/logging').createLogger('MLST aggregator');
const { MLST_RESULT } = require('utils/documentKeys');

const UNKNOWN_ST = 'new';
const UNKNOWN_ST_DISPLAY = '-';
const MISSING_ALLELE_ID = '?';

function getAlleleKeys(alleles) {
  const mlstAllelesQueryKeys = [];
  Object.keys(alleles).forEach(key => {
    const alleleQueryKey = alleles[key];
    if (alleleQueryKey !== null) {
      mlstAllelesQueryKeys.push(alleleQueryKey);
    }
  });
  return mlstAllelesQueryKeys;
}

function getMLSTAlleleDetails(alleles) {
  const queryKeys = getAlleleKeys(alleles);
  if (!queryKeys || !queryKeys.length) {
    return null;
  }
  return sequencesStorage.retrieveMany(queryKeys).
    then(({ results }) => results);
}

function getAlleleId(allele) {
  if (!allele || !allele.alleleId || allele.alleleId.toLowerCase() === UNKNOWN_ST) {
    return MISSING_ALLELE_ID;
  }
  return allele.alleleId;
}

function createMLSTCode(alleles, alleleDetails) {
  return Object.keys(alleles).reduce((memo, key) => {
    const allele = alleleDetails[alleles[key]];
    return `${memo ? `${memo}_` : ''}${getAlleleId(allele)}`;
  }, '');
}

function isMlstIncomplete(alleles, code) {
  return code.indexOf(MISSING_ALLELE_ID) !== -1;
}

function getSequenceType(alleles, code, speciesId) {
  LOGGER.info('Getting assembly ST data');
  LOGGER.debug(code);

  if (isMlstIncomplete(alleles, code)) {
    LOGGER.warn('Skipping ST query');
    return Promise.resolve({ code, sequenceType: UNKNOWN_ST_DISPLAY });
  }

  return mainStorage.retrieve(`ST_${speciesId}_${code}`).
    then(result => ({ code, sequenceType: result.stType })).
    catch(error => {
      if (error.code === 13) {
        LOGGER.warn('No ST key found');
        return Promise.resolve({ code, sequenceType: UNKNOWN_ST_DISPLAY });
      }
      return Promise.reject(error);
    });
}

module.exports = (name, { assemblyId, speciesId }) => {
  const { uuid } = assemblyId;
  return mainStorage.retrieve(`${MLST_RESULT}_${uuid}`).
    then(({ alleles }) =>
      getMLSTAlleleDetails(alleles).
      then((results) => createMLSTCode(alleles, results)).
      then(code => getSequenceType(alleles, code, speciesId)).
      then(result => ({
        st: result.sequenceType,
        code: result.code,
      })).
      then(result =>
        storeGenomeAnalysis(assemblyId, speciesId, name, result)
      )
    );
};
