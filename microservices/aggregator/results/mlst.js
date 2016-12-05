const CollectionAssembly = require('data/collectionAssembly');

const mainStorage = require('services/storage')('main');
const sequencesStorage = require('services/storage')('sequences');

const LOGGER = require('utils/logging').createLogger('MLST aggregator');
const { MLST_RESULT } = require('utils/documentKeys');

const UNKNOWN_ST = 'NEW';

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

function createMLSTCode(alleleDetails) {
  LOGGER.debug(alleleDetails);
  return Object.keys(alleleDetails).reduce((memo, key) => {
    const allele = alleleDetails[key];
    LOGGER.debug(memo, allele);
    if (!allele.alleleId || allele.alleleId.toUpperCase() === UNKNOWN_ST) {
      return memo;
    }
    return `${memo ? `${memo}_` : ''}${allele.alleleId}`;
  }, '');
}

function isMlstComplete(alleles, code) {
  LOGGER.debug(
    code.
      split('_').
      filter(section => section && section.length).
      length,
    Object.keys(alleles).length
  );
  return (
    code.
      split('_').
      filter(section => section && section.length).
      length === Object.keys(alleles).length
  );
}

function getSequenceType(alleles, code, speciesId) {
  LOGGER.info('Getting assembly ST data');
  LOGGER.debug(code);

  if (!isMlstComplete(alleles, code)) {
    LOGGER.warn('Skipping ST query');
    return Promise.resolve({ code, sequenceType: UNKNOWN_ST });
  }

  return mainStorage.retrieve(`ST_${speciesId}_${code}`).
    then(result => ({ code, sequenceType: result.stType })).
    catch(error => {
      if (error.code === 13) {
        LOGGER.warn('No ST key found');
        return Promise.resolve({ code, sequenceType: UNKNOWN_ST });
      }
      return Promise.reject(error);
    });
}

module.exports = ({ assemblyId, speciesId }) => {
  const { uuid } = assemblyId;
  return mainStorage.retrieve(`${MLST_RESULT}_${uuid}`).
    then(({ alleles }) => getMLSTAlleleDetail(alleles).
      then(createMLSTCode).
      then(code => getSequenceType(alleles, code, speciesId)).
      then(result => CollectionAssembly.update(
        { uuid }, {
          'analysis.mlst': {
            st: result.sequenceType,
            code: result.code,
          },
        }
      )));
};
