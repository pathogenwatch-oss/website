var sequenceTypeModel = require('models/sequenceType');
var socketService = require('services/socket');
var messageQueueService = require('services/messageQueue');
var mainStorage = require('services/storage')('main');

var LOGGER = require('utils/logging').createLogger('Assembly');
var TABLE_DATA_KEY_PREFIX = 'CORE_RESULT_';
var METADATA_KEY_PREFIX = 'ASSEMBLY_METADATA_';
var PAARSNP_KEY_PREFIX = 'PAARSNP_RESULT_';
var ASSEMBLY_KEY_PREFIXES = [
  'FP_COMP_',
  METADATA_KEY_PREFIX,
  PAARSNP_KEY_PREFIX,
  'MLST_RESULT_'
];
var ASSEMBLY_ANALYSES = {
  FP: 'FP_COMP',
  MLST: 'MLST_RESULT',
  PAARSNP: 'PAARSNP_RESULT',
  CORE: 'CORE_RESULT',
  SCCMEC: 'SCCMEC'
};

function beginUpload(ids, metadata, sequences) {
  socketService.notifyAssemblyUpload(ids, 'UPLOAD_OK');
  messageQueueService.newAssemblyNotificationQueue(
    ids,
    function (notificationQueue) {
      var expectedResults = Object.keys(ASSEMBLY_ANALYSES);
      notificationQueue.subscribe(function (error, message) {
        if (error) {
          return LOGGER.error(error);
        }

        var result = ASSEMBLY_ANALYSES[message.taskType];
        if (!result) {
          return LOGGER.warn('Skipping task: ' + message.taskType);
        }

        LOGGER.info(
          'Received notification for assembly ' + ids.assemblyId + ': ' + message.taskType
        );

        socketService.notifyAssemblyUpload(ids, result);
        expectedResults.splice(message.taskType, 1);

        LOGGER.info(
          'Remaining tasks for assembly ' + ids.assemblyId + ': ' + expectedResults
        );

        if (expectedResults.length === 0) {
          LOGGER.info(
            'Assembly ' + ids.assemblyId + ' tasks completed, destroying ' +
              notificationQueue.name
          );
          notificationQueue.destroy();
        }
      });

      var assemblyMetadata = {
        assemblyId: ids.assemblyId,
        fileAssemblyId: metadata.fileAssemblyId,
        date: metadata.date,
        geography: metadata.geography,
        source: metadata.source
      };

      mainStorage.store(
        METADATA_KEY_PREFIX + ids.assemblyId,
        assemblyMetadata,
        function () {
          socketService.notifyAssemblyUpload(ids, 'METADATA_OK');
        }
      );

      var assembly = {
        speciesId: '1280',
        assemblyId: ids.assemblyId,
        collectionId: ids.collectionId,
        sequences: sequences
      };

      messageQueueService.newAssemblyUploadQueue(ids.assemblyId,
        function (uploadQueue) {
          messageQueueService.getUploadExchange()
            .publish('upload', assembly, { replyTo: uploadQueue.name });
        }
      );
    }
  );
}

function get(assemblyId, callback) {
  LOGGER.info('Requested assembly id: ' + assemblyId);
  mainStorage.retrieve(assemblyId, callback);
}

function getMetadata(assemblyId, callback) {
  LOGGER.info('Requested assembly id: ' + assemblyId);
  mainStorage.retrieve(METADATA_KEY_PREFIX + assemblyId, callback);
}

function removeTrailingUnderscore(key) {
  return key.slice(0, -1);
}

function mergeAssemblyData(data, assemblyId) {
  var assembly = {};
  ASSEMBLY_KEY_PREFIXES.forEach(function (key) {
    var partName = removeTrailingUnderscore(key);
    assembly[partName] = data[key + assemblyId];
  });
  assembly.assemblyId = assemblyId;
  return assembly;
}

function constructAssemblyQueryKeys(assemblyId) {
  return ASSEMBLY_KEY_PREFIXES.map(function (key) {
    return key + assemblyId;
  });
}

function getComplete(assemblyId, callback) {
  LOGGER.info('Getting assembly ' + assemblyId);

  var assemblyQueryKeys = constructAssemblyQueryKeys(assemblyId);
  LOGGER.info('Assembly ' + assemblyId + ' query keys:');
  LOGGER.info(assemblyQueryKeys);

  mainStorage.retrieveMany(assemblyQueryKeys, function (error, assemblyData) {
    if (error) {
      return callback(error, null);
    }
    LOGGER.info('Got assembly ' + assemblyId + ' data');
    var assembly = mergeAssemblyData(assemblyData, assemblyId);
    sequenceTypeModel.addSequenceTypeData(assembly, function (stError, result) {
      if (stError) {
        return callback(stError, null);
      }
      callback(null, result);
    });
  });
}

function flatten(keys) {
  return keys.reduce(function (previous, current) {
    return previous.concat(current);
  }, []);
}

function matchQueryKeyPrefix(queryKey) {
  return ASSEMBLY_KEY_PREFIXES.filter(function (prefix) {
    return queryKey.indexOf(prefix) === 0;
  })[0];
}

function reconstructAssemblies(assemblyParts) {
  var assemblies = {};
  Object.keys(assemblyParts).forEach(function (queryKey) {
    var assemblyPart = assemblyParts[queryKey];

    var queryKeyPrefix = matchQueryKeyPrefix(queryKey);
    var assemblyId = queryKey.replace(queryKeyPrefix, '');
    var assemblyPartKey = removeTrailingUnderscore(queryKeyPrefix);
    var assembly;

    if (!assemblies.hasOwnProperty(assemblyId)) {
      assemblies[assemblyId] = {};
    }
    assembly = assemblies[assemblyId];
    assembly[assemblyPartKey] = assemblyPart;
  });

  Object.keys(assemblies).forEach(function (assemblyId) {
    assemblies[assemblyId].assemblyId = assemblyId;
  });

  return assemblies;
}

function getMany(assemblyIds, callback) {
  LOGGER.info('Getting assemblies with ids:');
  LOGGER.info(assemblyIds);

  // Merge all assembly ids
  var assemblyIdQueryKeys = flatten(
    assemblyIds.map(constructAssemblyQueryKeys)
  );

  LOGGER.info('Querying keys:');
  LOGGER.info(assemblyIdQueryKeys);

  mainStorage.retrieveMany(assemblyIdQueryKeys, function (error, assemblyParts) {
    if (error) {
      return callback(error, null);
    }

    LOGGER.info('Got assemblies data');

    var assemblies = reconstructAssemblies(assemblyParts);

    LOGGER.info('Assemblies with merged ' + ASSEMBLY_KEY_PREFIXES + ' data: ');
    LOGGER.info(assemblies);

    sequenceTypeModel.addSequenceTypeDataToMany(assemblies,
      function (error) {
        if (error) {
          return callback(error, null);
        }
        callback(null, assemblies);
      }
    );
  });
}

function getResistanceProfile(assemblyIds, callback) {
  LOGGER.info('Getting resistance profile for assembly ids: ' + assemblyIds);

  var queryKeys = assemblyIds.map(function (assemblyId) {
    return PAARSNP_KEY_PREFIX + assemblyId;
  });

  LOGGER.info('Resistance profile query keys: ' + queryKeys);

  mainStorage.retrieveMany(queryKeys, function (error, results) {
    if (error) {
      return callback(error, null);
    }
    LOGGER.info('Got resistance profile data:');
    LOGGER.info(results);

    callback(null, results);
  });
}

function projectTableData(assemblyData) {
  var projectedData = {};
  Object.keys(assemblyData).forEach(function (key) {
    var assembly = assemblyData[key];
    var newKey = key.replace(TABLE_DATA_KEY_PREFIX, '');
    projectedData[newKey] = {
      assemblyId: assembly.assemblyId,
      completeAlleles: assembly.completeAlleles
    };
  });
  return projectedData;
}

function getTableData(assemblyIds, callback) {
  LOGGER.info('Getting table data for assemblies: ' + assemblyIds.join(', '));

  var tableQueryKeys = assemblyIds.map(function (assemblyId) {
    return (TABLE_DATA_KEY_PREFIX + assemblyId);
  });

  LOGGER.info('Prepared query keys: ' + tableQueryKeys.join(', '));

  mainStorage.retrieveMany(tableQueryKeys, function (error, tableData) {
    if (error) {
      return callback(error, null);
    }

    LOGGER.info('Got table data for assemblies ' + assemblyIds.join(', '));
    LOGGER.info(tableData);

    callback(null, projectTableData(tableData));
  });
}

function getCoreResult(id, callback) {
  mainStorage.retrieve('CORE_RESULT_' + id, function (error, result) {
    if (error) {
      return callback(error, null);
    }
    callback(null, {
      totalCompleteCoreMatches: result.totalCompleteCoreMatches,
      totalCompleteAlleleMatches: result.totalCompleteAlleleMatches
    });
  });
}

function mapTaxaToAssembly(assemblies) {
  return Object.keys(assemblies).reduce(function (map, assemblyId) {
    var taxon = assemblies[assemblyId].FP_COMP.subTypeAssignment;
    if (taxon in map) {
      map[taxon].assemblyIds.push(assemblyId);
    } else {
      map[taxon] = { assemblyIds: [ assemblyId ] };
    }
    return map;
  }, {});
}

function getReference(speciesId, assemblyId, callback) {
  var metadataKey = 'ASSEMBLY_METADATA_' + assemblyId;
  var mlstKey = 'MLST_RESULT_' + speciesId + '_' + assemblyId;
  var paarsnpKey = 'PAARSNP_RESULT_' + speciesId + '_' + assemblyId;
  var assemblyQueryKeys = [ mlstKey, paarsnpKey, metadataKey ];
  LOGGER.info('Assembly ' + assemblyId + ' query keys:');
  LOGGER.info(assemblyQueryKeys);

  mainStorage.retrieveMany(assemblyQueryKeys, function (error, assemblyData) {
    if (error) {
      return callback(error, null);
    }
    LOGGER.info('Got assembly ' + assemblyId + ' data');
    var assembly = {
      ASSEMBLY_METADATA: assemblyData[metadataKey],
      MLST_RESULT: assemblyData[mlstKey],
      PAARSNP_RESULT: assemblyData[paarsnpKey]
    };
    sequenceTypeModel.addSequenceTypeData(assembly, function (stError, result) {
      if (stError) {
        return callback(stError, null);
      }
      callback(null, result);
    });
  });
}

module.exports.get = get;
module.exports.getComplete = getComplete;
module.exports.getMany = getMany;
module.exports.getTableData = getTableData;
module.exports.beginUpload = beginUpload;
module.exports.getResistanceProfile = getResistanceProfile;
module.exports.getCoreResult = getCoreResult;
module.exports.getMetadata = getMetadata;
module.exports.mapTaxaToAssembly = mapTaxaToAssembly;
module.exports.getReference = getReference;
