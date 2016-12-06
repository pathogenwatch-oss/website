const CollectionAssembly = require('data/collectionAssembly');

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

function getMLSTAlleleDetail(alleles) {
  const queryKeys = getAlleleKeys(alleles);
  if (!queryKeys || !queryKeys.length) {
    return null;
  }
  return sequencesStorage.retrieveMany(queryKeys).
    then(({ results }) => results);
}

function getAlleleId({ alleleId }) {
  if (!alleleId || alleleId.toLowerCase() === UNKNOWN_ST) {
    return MISSING_ALLELE_ID;
  }
  return alleleId;
}

function createMLSTCode(alleleDetails) {
  return Object.keys(alleleDetails).reduce((memo, key) => {
    const allele = alleleDetails[key];
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
    then(({ alleles }) => getMLSTAlleleDetail(alleles).
      then(createMLSTCode).
      then(code => getSequenceType(alleles, code, speciesId)).
      then(result => ({
        st: result.sequenceType,
        code: result.code,
      })).
      then(result => CollectionAssembly.addAnalysisResult(uuid, name, result))
    );
};
