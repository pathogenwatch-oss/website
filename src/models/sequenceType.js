const async = require('async');

const mainStorage = require('services/storage')('main');
const sequencesStorage = require('services/storage')('sequences');

const LOGGER = require('utils/logging').createLogger('sequenceType');
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

function getMLSTAlleleDetails(alleles, callback) {
  const queryKeys = getAlleleKeys(alleles);
  if (!queryKeys || !queryKeys.length) {
    callback(null, {}); // must return for async waterfall to work
    return;
  }
  sequencesStorage.retrieveMany(queryKeys, (error, results) => {
    if (error) {
      callback(error);
      return;
    }
    callback(null, results);
  });
}

function getAlleleId(allele) {
  if (!allele || !allele.alleleId || !allele.alleleId.toLowerCase() === UNKNOWN_ST) {
    return MISSING_ALLELE_ID;
  }
  return allele.alleleId;
}

function createMLSTCode(alleles, alleleDetails, callback) {
  callback(
    null,
    Object.keys(alleles).reduce((memo, key) => {
      const allele = alleleDetails[alleles[key]];
      return `${memo ? `${memo}_` : ''}${getAlleleId(allele)}`;
    }, '')
  );
}

function isMlstIncomplete(alleles, code) {
  return code.indexOf(MISSING_ALLELE_ID) !== -1;
}

function getSequenceType({ alleles, code, speciesId }, callback) {
  LOGGER.info('Getting assembly ST data');
  LOGGER.debug(code);

  if (isMlstIncomplete(alleles, code)) {
    LOGGER.warn('Skipping ST query');
    callback(null, { code, sequenceType: UNKNOWN_ST_DISPLAY });
    return;
  }

  mainStorage.retrieve(`ST_${speciesId}_${code}`, (error, result) => {
    if (error) {
      if (error.code === 13) { // no sequence type found
        callback(null, { code, sequenceType: UNKNOWN_ST_DISPLAY });
        return;
      }
      callback(error);
      return;
    }
    callback(null, { code, sequenceType: result.stType });
  });
}

function addSequenceTypeData(assembly, speciesId, callback) {
  if (!assembly[MLST_RESULT]) {
    callback(null, assembly);
    return;
  }

  async.waterfall([
    next => mainStorage.retrieve(
      `${MLST_RESULT}_${assembly.assemblyId}`,
      (error, result) => (error ? next(error) : next(null, result))
    ),
    ({ alleles }, done) => {
      async.waterfall([
        next => getMLSTAlleleDetails(alleles, next),
        (details, next) => createMLSTCode(alleles, details, next),
        (code, next) => getSequenceType({ alleles, code, speciesId }, next),
      ], done);
    },
  ], (error, result) => {
    if (error) {
      callback(error);
      return;
    }

    LOGGER.info('Got assembly ST data');
    assembly[MLST_RESULT].sequenceType = result.sequenceType;
    assembly[MLST_RESULT].code = result.code;
    callback(null, assembly);
  });
}

module.exports.addSequenceTypeData = addSequenceTypeData;
