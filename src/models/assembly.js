var sequenceTypeModel = require('models/sequenceType');
var socketService = require('services/socket');
var messageQueueService = require('services/messageQueue');
var mainStorage = require('services/storage')('main');

var LOGGER = require('utils/logging').createLogger('Assembly');

var METADATA_KEY = 'ASSEMBLY_METADATA';
var PAARSNP_KEY = 'PAARSNP_RESULT';
var MLST_KEY = 'MLST_RESULT';
var FP_COMP_KEY = 'FP_COMP';
var CORE_KEY = 'CORE_SLIM';

var ASSEMBLY_ANALYSES = [ 'FP', 'MLST', 'PAARSNP', 'CORE' ];

var systemMetadataColumns = [
  'assemblyId', 'soeciesId', 'assemblyName',
  'date', 'year', 'month', 'day',
  'position', 'latitude', 'longitude',
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
      createKey(ids.assemblyId, METADATA_KEY),
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
  var paarsnp = assembly[PAARSNP_KEY];
  return {
    populationSubtype: assembly[FP_COMP_KEY] ? assembly[FP_COMP_KEY].subTypeAssignment : null,
    metadata: assembly[METADATA_KEY],
    analysis: {
      st: assembly[MLST_KEY].sequenceType,
      mlst: assembly[MLST_KEY].code,
      kernelSize: assembly[CORE_KEY].kernelSize,
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
              profile[antibiotic] = {
                antibioticClass: className,
                resistanceResult: antibioticClass[antibiotic]
              };
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

  var keys = [
    METADATA_KEY,
    CORE_KEY,
    FP_COMP_KEY,
    MLST_KEY,
  ];

  // HACK: skip PAARSNP for listeria
  if (params.speciesId !== '1639') {
    keys.push(PAARSNP_KEY);
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
    METADATA_KEY,
    MLST_KEY,
  ], function (error, assembly) {
    if (error) {
      return callback(error, null);
    }
    callback(null, {
      metadata: assembly[METADATA_KEY],
      analysis: {
        st: assembly[MLST_KEY].sequenceType
      }
    });
  });
}

function mapTaxaToAssemblies(assemblies) {
  return Object.keys(assemblies).reduce(function (map, assemblyId) {
    var taxon = assemblies[assemblyId].populationSubtype;

    if (!taxon || taxon.toLowerCase() === 'none') {
      return map;
    }

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
