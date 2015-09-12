var sequenceTypeModel = require('models/sequenceType');
var socketService = require('services/socket');
var messageQueueService = require('services/messageQueue');
var mainStorage = require('services/storage')('main');

var LOGGER = require('utils/logging').createLogger('Assembly');

var METADATA_KEY = 'ASSEMBLY_METADATA';
var PAARSNP_KEY = 'PAARSNP_RESULT';
var MLST_KEY = 'MLST_RESULT';
var FP_COMP_KEY = 'FP_COMP';

var ASSEMBLY_ANALYSES = {
  FP: FP_COMP_KEY,
  MLST: MLST_KEY,
  PAARSNP: PAARSNP_KEY,
  CORE: 'CORE_RESULT',
  SCCMEC: 'SCCMEC'
};

var systemMetadataColumns = [
  'assemblyId', 'soeciesId', 'assemblyName',
  'date', 'year', 'month', 'day',
  'geography', 'latitude', 'longitude', 'location'
];

function createKey(id, prefix) {
  return prefix + '_' + id;
}

function filterUserDefinedMetadata(metadata) {
  return Object.keys(metadata).reduce(function (memo, key) {
    if (systemMetadataColumns.indexOf(key) === -1) {
      memo[key] = metadata[key];
    }
    return memo;
  }, {});
}

function createMetadataRecord(ids, metadata) {
  return {
    assemblyId: ids.assemblyId,
    assemblyName: metadata.assemblyName,
    speciesId: ids.speciesId,
    date: metadata.date || {
      year: metadata.year,
      month: metadata.month,
      day: metadata.day,
    },
    geography: metadata.geography || {
      position: {
        latitude: metadata.latitude,
        longitude: metadata.longitude
      },
      location: metadata.location
    },
    userDefined: filterUserDefinedMetadata(metadata)
  };
}

function beginUpload(ids, metadata, sequences) {
  socketService.notifyAssemblyUpload(ids, 'UPLOAD_OK');
  messageQueueService.newAssemblyNotificationQueue(ids, {
    tasks: Object.keys(ASSEMBLY_ANALYSES),
    loggingId: 'Assembly ' + ids.assemblyId,
    notifyFn: socketService.notifyAssemblyUpload.bind(socketService, ids)
  }, function () {
    var assemblyMetadata = createMetadataRecord(ids, metadata);

    var assembly = {
      speciesId: ids.speciesId,
      assemblyId: ids.assemblyId,
      collectionId: ids.collectionId,
      sequences: sequences
    };

    mainStorage.store(
      createKey(ids.assemblyId, METADATA_KEY),
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

function constructQueryKeys(prefixes, assemblyId) {
  return prefixes.map(createKey.bind(null, assemblyId));
}

function mergeQueryResults(data, queryKeyPrefixes, assemblyId) {
  return queryKeyPrefixes.reduce(function (assembly, key) {
    assembly[key] = data[createKey(assemblyId, key)];
    return assembly;
  }, { assemblyId: assemblyId });
}

function formatForFrontend(assembly) {
  return {
    populationSubtype: assembly.FP_COMP ? assembly.FP_COMP.subTypeAssignment : null,
    metadata: assembly.ASSEMBLY_METADATA,
    analysis: {
      st: assembly.MLST_RESULT.stType,
      resistanceProfile: assembly.PAARSNP_RESULT ?
        Object.keys(assembly.PAARSNP_RESULT.resistanceProfile).
          reduce(function (profile, className) {
            var antibioticClass = assembly.PAARSNP_RESULT.resistanceProfile[className];
            Object.keys(antibioticClass).forEach(function (antibiotic) {
              profile[antibiotic] = {
                antibioticClass: className,
                resistanceResult: antibioticClass[antibiotic]
              };
            });
            return profile;
          }, {}) : null
    }
  };
}

function get(params, queryKeyPrefixes, callback) {
  var assemblyId = params.assemblyId;
  var speciesId = params.speciesId;
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
    sequenceTypeModel.addSequenceTypeData(assembly, speciesId, function (stError, result) {
      if (stError) {
        return callback(stError, null);
      }
      callback(null, formatForFrontend(result));
    });
  });
}

function getComplete(params, callback) {
  LOGGER.info('Getting assembly ' + params.assemblyId);
  get(params, [
    METADATA_KEY,
    PAARSNP_KEY,
    MLST_KEY,
    FP_COMP_KEY
  ], callback);
}

function getReference(params, callback) {
  LOGGER.info('Getting reference assembly ' + params.assemblyId);
  get(params, [
    METADATA_KEY,
    PAARSNP_KEY,
    MLST_KEY
  ], callback);
}

function mapTaxaToAssemblies(assemblies) {
  return Object.keys(assemblies).reduce(function (map, assemblyId) {
    var taxon = assemblies[assemblyId].populationSubtype;
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
module.exports.mapTaxaToAssemblies = mapTaxaToAssemblies;
module.exports.createMetadataRecord = createMetadataRecord;
