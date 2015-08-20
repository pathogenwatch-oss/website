var sequenceTypeModel = require('models/sequenceType');
var socketService = require('services/socket');
var messageQueueService = require('services/messageQueue');
var mainStorage = require('services/storage')('main');

var LOGGER = require('utils/logging').createLogger('Assembly');

var METADATA_KEY_PREFIX = 'ASSEMBLY_METADATA_';
var PAARSNP_KEY_PREFIX = 'PAARSNP_RESULT_';
var MLST_KEY_PREFIX = 'MLST_RESULT_';
var ASSEMBLY_KEY_PREFIXES = [
  'FP_COMP_',
  METADATA_KEY_PREFIX,
  PAARSNP_KEY_PREFIX,
  MLST_KEY_PREFIX
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
      speciesId: ids.speciesId,
      date: metadata.date,
      geography: metadata.geography,
      source: metadata.source
    };

    var assembly = {
      speciesId: ids.speciesId,
      assemblyId: ids.assemblyId,
      collectionId: ids.collectionId,
      sequences: sequences
    };

    mainStorage.store(
      METADATA_KEY_PREFIX + ids.assemblyId,
      assemblyMetadata,
      function () {
        socketService.notifyAssemblyUpload(ids, 'METADATA_OK');
      }
    );

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

function mergeQueryResults(data, queryKeyPrefixes, assemblyId) {
  return queryKeyPrefixes.reduce(function (assembly, key) {
    var partName = removeTrailingUnderscore(key);
    assembly[partName] = data[key + assemblyId];
    return assembly;
  }, { assemblyId: assemblyId });
}

function constructQueryKeys(prefixes, assemblyId) {
  return prefixes.map(function (key) {
    return key + assemblyId;
  });
}

function get(assemblyId, queryKeyPrefixes, callback) {
  var queryKeys = constructQueryKeys(queryKeyPrefixes, assemblyId);
  LOGGER.info('Assembly ' + assemblyId + ' query keys:');
  LOGGER.info(queryKeys);

  mainStorage.retrieveMany(queryKeys, function (error, assemblyData) {
    var assembly;

    if (error) {
      return callback(error, null);
    }

    LOGGER.info('Got assembly ' + assemblyId + ' data');
    assembly = mergeQueryResults(assemblyData, queryKeyPrefixes, assemblyId);
    sequenceTypeModel.addSequenceTypeData(assembly, function (stError, result) {
      if (stError) {
        return callback(stError, null);
      }
      callback(null, result);
    });
  });
}

function getComplete(assemblyId, callback) {
  LOGGER.info('Getting assembly ' + assemblyId);
  get(assemblyId, ASSEMBLY_KEY_PREFIXES, callback);
}

function getReference(speciesId, assemblyId, callback) {
  LOGGER.info('Getting reference assembly ' + assemblyId);
  get(assemblyId, [
    METADATA_KEY_PREFIX, PAARSNP_KEY_PREFIX, MLST_KEY_PREFIX
  ], callback);
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

module.exports.beginUpload = beginUpload;
module.exports.getComplete = getComplete;
module.exports.getReference = getReference;
module.exports.mapTaxaToAssembly = mapTaxaToAssembly;
