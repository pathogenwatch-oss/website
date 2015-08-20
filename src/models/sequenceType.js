var async = require('async');

var mainStorage = require('services/storage')('main');
var sequencesStorage = require('services/storage')('sequences');

var LOGGER = require('utils/logging').createLogger('sequenceType');
var UNKNOWN_ST = 'New';

function getMlstQueryKeys(assembly) {
  if (!assembly || !assembly.MLST_RESULT) {
    return false;
  }
  var mlstAllelesQueryKeys = [];
  Object.keys(assembly.MLST_RESULT.alleles).forEach(function (key) {
    var alleleQueryKey = assembly.MLST_RESULT.alleles[key];
    if (alleleQueryKey !== null) {
      mlstAllelesQueryKeys.push(alleleQueryKey);
    }
  });
  return mlstAllelesQueryKeys;
}

function getMlstAllelesData(assembly, callback) {
  var queryKeys = getMlstQueryKeys(assembly);
  if (!queryKeys) {
    return callback(new Error('Assembly or MLST result missing'));
  }
  LOGGER.info('Getting MLST alleles data');
  sequencesStorage.retrieveMany(queryKeys, function (error, mlstAllelesData) {
    if (error) {
      return callback(error, null);
    }
    LOGGER.info('Got MLST alleles data');
    callback(null, mlstAllelesData);
  });
}

function addMlstAlleleToAssembly(assembly, mlstAlleles) {
  Object.keys(mlstAlleles).forEach(function (key) {
    var mlstAllele = mlstAlleles[key];
    var locusId = mlstAllele.locusId;
    assembly.MLST_RESULT.alleles[locusId] = mlstAllele;
  });
}

function generateStQueryKey(alleles) {
  LOGGER.info('Generating ST Query key');
  // Prepare ST query key
  // 'ST_' + species id + allele ids
  var stQueryKey = 'ST_1280';
  var queryKeyIsComplete = true;
  Object.keys(alleles).forEach(function (key) {
    var allele = alleles[key];
    if (!allele || !allele.alleleId || allele.alleleId === UNKNOWN_ST) {
      queryKeyIsComplete = false;
      return;
    }
    stQueryKey += '_' + allele.alleleId;
  });
  return queryKeyIsComplete ? stQueryKey : null;
}

function getSequenceType(assembly, callback) {
  LOGGER.info('Getting assembly ST data');
  var stQueryKey = generateStQueryKey(assembly.MLST_RESULT.alleles);
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
    LOGGER.info('St Type result: ' + result.stType);
    callback(null, result.stType);
  });
}

function addSequenceTypeData(assembly, callback) {
  async.waterfall([
    function (next) {
      getMlstAllelesData(assembly, next);
    },
    function (mlstAlleles, next) {
      LOGGER.info('Got assembly MLST alleles data');
      addMlstAlleleToAssembly(assembly, mlstAlleles);
      getSequenceType(assembly, next);
    },
    function (sequenceType, next) {
      LOGGER.info('Got assembly ST data');
      assembly.MLST_RESULT.stType = sequenceType;
      next(asssembly);
    }
  ], callback);
}

module.exports.addSequenceTypeData = addSequenceTypeData;
