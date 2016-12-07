var async = require('async');

var mainStorage = require('services/storage')('main');
var sequencesStorage = require('services/storage')('sequences');

var LOGGER = require('utils/logging').createLogger('sequenceType');
const { MLST_RESULT } = require('utils/documentKeys');

var UNKNOWN_ST = 'New';

function getMlstQueryKeys(assembly) {
  var mlstAllelesQueryKeys;

  if (!assembly || !assembly[MLST_RESULT]) {
    return false;
  }

  mlstAllelesQueryKeys = [];
  Object.keys(assembly[MLST_RESULT].alleles).forEach(function (key) {
    var alleleQueryKey = assembly[MLST_RESULT].alleles[key];
    if (alleleQueryKey !== null) {
      mlstAllelesQueryKeys.push(alleleQueryKey);
    }
  });
  return mlstAllelesQueryKeys;
}

function getMlstAllelesData(assembly, callback) {
  var queryKeys = getMlstQueryKeys(assembly);
  if (!queryKeys || !queryKeys.length) {
    return callback(null, null);
  }
  LOGGER.info('Getting MLST alleles data');
  sequencesStorage.retrieveMany(queryKeys, function (error, { results }) {
    if (error) {
      return callback(error, null);
    }
    LOGGER.info('Got MLST alleles data');
    callback(null, results);
  });
}

function addMlstAllelesToAssembly(assembly, mlstAlleles) {
  var alleles = assembly[MLST_RESULT].alleles;
  var locusIds = Object.keys(alleles);

  Object.keys(mlstAlleles).forEach(function (key) {
    var mlstAllele = mlstAlleles[key];
    if (mlstAllele && mlstAllele.locusId) {
      alleles[mlstAllele.locusId] = mlstAllele;
    }
  });

  assembly[MLST_RESULT].code = locusIds.slice(1).reduce(function (memo, locusId) {
    var allele = alleles[locusId];
    if (!allele || !allele.alleleId || allele.alleleId === UNKNOWN_ST) {
      return memo;
    }
    return memo + '_' + allele.alleleId;
  }, alleles[locusIds[0]] ? alleles[locusIds[0]].alleleId : '');
}

function isMlstComplete(mlstResult) {
  return (
    mlstResult.code.split('_').
      filter(function (section) {
        return section && section.length;
      }).length === Object.keys(mlstResult.alleles).length
  );
}

// 'ST_' + species id + mlst code
function generateStQueryKey(speciesId, mlstResult) {
  return isMlstComplete(mlstResult) ? 'ST_' + speciesId + '_' + mlstResult.code : null;
}

function getSequenceType(assembly, speciesId, callback) {
  var stQueryKey;

  LOGGER.info('Getting assembly ST data');
  stQueryKey = generateStQueryKey(speciesId, assembly[MLST_RESULT]);

  if (stQueryKey === null) {
    LOGGER.warn('Skipping ST query for assembly ' + assembly.assemblyId);
    return callback(null, UNKNOWN_ST);
  }

  mainStorage.retrieve(stQueryKey, function (error, result) {
    if (error) {
      if (error.code === 13) {
        LOGGER.warn('No ST key found: ' + stQueryKey);
        return callback(null, UNKNOWN_ST);
      }
      return callback(error, null);
    }
    LOGGER.info('Sequence Type result: ' + result.stType);
    callback(null, result.stType);
  });
}

function addSequenceTypeData(assembly, speciesId, callback) {
  if (!assembly[MLST_RESULT]) {
    return callback(null, assembly);
  }

  async.waterfall([
    function (next) {
      getMlstAllelesData(assembly, next);
    },
    function (mlstAlleles, next) {
      if (!mlstAlleles) {
        return next(null, assembly[MLST_RESULT].stCode || UNKNOWN_ST);
      }
      LOGGER.info('Got assembly MLST alleles data');
      addMlstAllelesToAssembly(assembly, mlstAlleles);
      getSequenceType(assembly, speciesId, next);
    },
    function (sequenceType, next) {
      LOGGER.info('Got assembly ST data');
      assembly[MLST_RESULT].sequenceType = sequenceType;
      next(null, assembly);
    },
  ], callback);
}

module.exports.addSequenceTypeData = addSequenceTypeData;
