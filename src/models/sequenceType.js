var async = require('async');

var mainStorage = require('services/storage')('main');

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
  mainStorage.retrieveMany(queryKeys, function (error, mlstAllelesData) {
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
      } else {
        return callback(error, null);
      }
    }
    LOGGER.info('St Type result: ' + result.stType);
    callback(null, result.stType);
  });
}

function addSequenceTypeData(assembly, callback) {
  async.waterfall([
    function (callback) {
      getMlstAllelesData(assembly, callback);
    },
    function (mlstAlleles, callback) {
      LOGGER.info('Got assembly MLST alleles data');
      addMlstAlleleToAssembly(assembly, mlstAlleles);
      getSequenceType(assembly, callback);
    },
    function (sequenceType, callback) {
      LOGGER.info('Got assembly ST data');
      assembly.MLST_RESULT.stType = sequenceType;
      callback();
    }
  ],
  function (error) {
    if (error) {
      return callback(error, null);
    }
    callback(null, assembly);
  });
}

function mapMlstDataToKeys(mlstData, mlstKeys) {
  return mlstKeys.reduce(function (map, key) {
    map[key] = mlstData[key];
    return map;
  }, {});
}

/**
 * Steps:
 *   - get a flat list of all MLST allele keys in all assemblies
 *   - index MLST allele keys by assembly ID
 *   - retrieve the allele data for each key
 *   - add allele data back to each assembly
 *   - get an ST key for each assembly
 *   - index assembly ids by ST Key
 *   - return the ST for each key
 *   - add ST to each assembly
 */
function addSequenceTypeDataToMany(assemblies, callback) {
  var allAssembliesMlstAllelesQueryKeys = [];
  var mlstQueryKeysByAssemblyIdMap = {};

  Object.keys(assemblies).forEach(function (assemblyId) {
    var mlstQueryKeys = getMlstQueryKeys(assemblies[assemblyId]);
    if (!mlstQueryKeys) {
      return callback(new Error('Missing assembly or MLST result'));
    }
    mlstQueryKeysByAssemblyIdMap[assemblyId] = mlstQueryKeys;
    allAssembliesMlstAllelesQueryKeys =
      allAssembliesMlstAllelesQueryKeys.concat(mlstQueryKeys);
  });

  mainStorage.retrieveMany(allAssembliesMlstAllelesQueryKeys,
    function (error, mlstAllelesData) {
      if (error) {
        return callback(error, null);
      }

      Object.keys(mlstQueryKeysByAssemblyIdMap).forEach(function (assemblyId) {
        var mlstQueryKeys = mlstQueryKeysByAssemblyIdMap[assemblyId];
        addMlstAlleleToAssembly(
          assemblies[assemblyId],
          mapMlstDataToKeys(mlstAllelesData, mlstQueryKeys)
        );
      });

      var assemblyAlleles = Object.keys(assemblies).map(function (assemblyId) {
        var assembly = assemblies[assemblyId];
        return {
          assemblyId: assemblyId,
          assemblyAlleles: assembly.MLST_RESULT.alleles
        };
      });

      var assemblyIdsByStQueryKeyMap = {};
      var assemblyIdsWithNewST = [];
      assemblyAlleles.forEach(function (assembly) {
        var stQueryKey = generateStQueryKey(assembly.assemblyAlleles);
        // Do not query empty keys
        if (stQueryKey === null) {
          LOGGER.warn('Skipping ST query for assembly ' + assembly.assemblyId);
          assemblyIdsWithNewST.push(assembly.assemblyId);
        } else {
          if (!assemblyIdsByStQueryKeyMap.hasOwnProperty(stQueryKey)) {
            assemblyIdsByStQueryKeyMap[stQueryKey] = [];
          }
          assemblyIdsByStQueryKeyMap[stQueryKey].push(assembly.assemblyId);
        }
      });

      mainStorage.retrieveMany(Object.keys(assemblyIdsByStQueryKeyMap),
        function (error, allStData) {
          if (error) {
            callback(error, null);
          }

          Object.keys(allStData).forEach(function (key) {
            var sequenceType = allStData[key].stType || UNKNOWN_ST;
            assemblyIdsByStQueryKeyMap[key].forEach(function (assemblyId) {
              assemblies[assemblyId].MLST_RESULT.stType = sequenceType;
            });
          });

          // resolve skipped ST queries
          assemblyIdsWithNewST.forEach(function (assemblyId) {
            assemblies[assemblyId].MLST_RESULT.stType = UNKNOWN_ST;
          });

          callback(null, assemblies);
        }
      );
    }
  );
}

module.exports.addSequenceTypeData = addSequenceTypeData;
module.exports.addSequenceTypeDataToMany = addSequenceTypeDataToMany;
