var sequenceTypeModel = require('models/sequenceType');
var socketService = require('services/socket');
var messageQueueService = require('services/messageQueue');
var mainStorage = require('services/storage')('main');

var LOGGER = require('utils/logging').createLogger('Assembly');

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
  messageQueueService.newAssemblyNotificationQueue(ids, {
    tasks: Object.keys(ASSEMBLY_ANALYSES),
    loggingId: 'Assembly ' + ids.assemblyId,
    notifyFn: socketService.notifyAssemblyUpload.bind(socketService, ids)
  }, function () {
    var assemblyMetadata = {
      assemblyId: ids.assemblyId,
      assemblyFilename: metadata.assemblyFilename,
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
      speciesId: ids.speciesId,
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
  });
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

module.exports.getComplete = getComplete;
module.exports.beginUpload = beginUpload;
module.exports.mapTaxaToAssembly = mapTaxaToAssembly;
module.exports.getReference = getReference;
