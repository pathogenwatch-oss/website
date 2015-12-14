var sequenceTypeModel = require('models/sequenceType');
var socketService = require('services/socket');
var messageQueueService = require('services/messageQueue');
var mainStorage = require('services/storage')('main');

var LOGGER = require('utils/logging').createLogger('Assembly');
const {
  ASSEMBLY_METADATA,
  PAARSNP_RESULT,
  MLST_RESULT,
  FP_COMP,
  CORE_SLIM,
} = require('utils/documentKeys');

var ASSEMBLY_ANALYSES = [ 'FP', 'MLST', 'PAARSNP', 'CORE' ];

var systemMetadataColumns = [
  'assemblyId', 'speciesId', 'assemblyName',
  'date', 'year', 'month', 'day',
  'position', 'latitude', 'longitude',
  'filename'
];

function createKey(id, prefix) {
  return prefix + '_' + id;
}

function filterUserDefinedColumns(metadata) {
  return Object.keys(metadata).reduce(function (memo, key) {
    if (systemMetadataColumns.indexOf(key) === -1) {
      memo[key] = metadata[key];
    }
    return memo;
  }, {});
}

function createMetadataRecord(ids, metadata, metrics) {
  return {
    assemblyId: ids.assemblyId,
    speciesId: ids.speciesId,
    assemblyName: metadata.assemblyName,
    date: metadata.date || {
      year: metadata.year,
      month: metadata.month,
      day: metadata.day,
    },
    position: metadata.position || {
      latitude: metadata.latitude,
      longitude: metadata.longitude
    },
    userDefined: filterUserDefinedColumns(metadata),
    metrics
  };
}

function beginUpload(ids, data) {
  messageQueueService.newAssemblyNotificationQueue(ids, {
    tasks: ASSEMBLY_ANALYSES,
    loggingId: 'Assembly ' + ids.assemblyId,
    notifyFn: socketService.notifyAssemblyUpload.bind(socketService, ids)
  }, function () {
    var assemblyMetadata = createMetadataRecord(ids, data.metadata, data.metrics);
    var assembly = {
      speciesId: ids.speciesId,
      assemblyId: ids.assemblyId,
      collectionId: ids.collectionId,
      sequences: data.sequences
    };

    mainStorage.store(
      createKey(ids.assemblyId, ASSEMBLY_METADATA),
      assemblyMetadata,
      function () {
        socketService.notifyAssemblyUpload(ids, 'METADATA_OK');
      }
    );

    messageQueueService.newAssemblyUploadQueue(ids.assemblyId,
      function (uploadQueue) {
        uploadQueue.subscribe(function () {
          LOGGER.info('Received response from ' + this.name + ', destroying.');
          uploadQueue.destroy();
          socketService.notifyAssemblyUpload(ids, 'UPLOAD_OK');
        });

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
  var paarsnp = assembly[PAARSNP_RESULT];
  return {
    populationSubtype: assembly[FP_COMP] ? assembly[FP_COMP].subTypeAssignment : null,
    metadata: assembly[ASSEMBLY_METADATA],
    analysis: {
      st: assembly[MLST_RESULT].sequenceType,
      mlst: assembly[MLST_RESULT].code,
      kernelSize: assembly[CORE_SLIM].kernelSize,
      // snpar: paarsnp.snparResult.completeSets.map(function (set) {
      //   return { repSequenceId: set.repSequenceId, setId: set.setId };
      // }),
      // paar: paarsnp.paarResult.completeResistanceSets.map(function (set) {
      //   return set.resistanceSetName;
      // }),
      resistanceProfile: paarsnp ?
        Object.keys(paarsnp.resistanceProfile).
          reduce(function (profile, className) {
            var antibioticClass = paarsnp.resistanceProfile[className];
            Object.keys(antibioticClass).forEach(function (antibiotic) {
              profile[antibiotic] = antibioticClass[antibiotic];
            });
            return profile;
          }, {}) : {}
    }
  };
}

function get(params, queryKeyPrefixes, callback) {
  var assemblyId = params.assemblyId;
  var queryKeys = constructQueryKeys(queryKeyPrefixes, assemblyId);

  LOGGER.info('Assembly ' + assemblyId + ' query keys:');
  LOGGER.info(queryKeys);

  mainStorage.retrieveMany(queryKeys, function (error, assemblyData) {
    var assembly;

    if (error) {
      return callback(error);
    }
    LOGGER.info('Got assembly ' + assemblyId + ' data');
    assembly = mergeQueryResults(assemblyData, queryKeyPrefixes, assemblyId);
    sequenceTypeModel.addSequenceTypeData(assembly, params.speciesId, function (stError, result) {
      if (stError) {
        return callback(stError);
      }
      callback(null, result);
    });
  });
}

function getComplete(params, callback) {
  LOGGER.info('Getting assembly ' + params.assemblyId);

  const keys = [
    ASSEMBLY_METADATA,
    CORE_SLIM,
    FP_COMP,
    MLST_RESULT,
  ];

  // HACK: skip PAARSNP for listeria
  if (params.speciesId !== '1639') {
    keys.push(PAARSNP_RESULT);
  }

  get(params, keys, function (error, assembly) {
    if (error) {
      return callback(error);
    }
    callback(null, formatForFrontend(assembly));
  });
}

function getReference(params, callback) {
  LOGGER.info('Getting reference assembly ' + params.assemblyId);
  get(params, [
    ASSEMBLY_METADATA,
    MLST_RESULT,
  ], function (error, assembly) {
    if (error) {
      return callback(error, null);
    }
    callback(null, {
      metadata: assembly[ASSEMBLY_METADATA],
      analysis: {
        st: assembly[MLST_RESULT].sequenceType
      }
    });
  });
}

function groupAssembliesBySubtype(assemblies) {
  return Object.keys(assemblies).reduce(function (map, assemblyId) {
    var taxon = assemblies[assemblyId].populationSubtype;

    if (!taxon || taxon.toLowerCase() === 'none') {
      return map;
    }

    if (taxon in map) {
      map[taxon].assemblyIds.push(assemblyId);
    } else {
      map[taxon] = {
        name: taxon,
        assemblyIds: [ assemblyId ],
      };
    }
    return map;
  }, {});
}

module.exports.beginUpload = beginUpload;
module.exports.getComplete = getComplete;
module.exports.getReference = getReference;
module.exports.groupAssembliesBySubtype = groupAssembliesBySubtype;
module.exports.createMetadataRecord = createMetadataRecord;
