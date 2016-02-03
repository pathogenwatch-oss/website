var async = require('async');

var sequenceTypeModel = require('models/sequenceType');
var messageQueueService = require('services/messageQueue');
var mainStorage = require('services/storage')('main');

var LOGGER = require('utils/logging').createLogger('Assembly');
const {
  ASSEMBLY_METADATA,
  PAARSNP_RESULT,
  MLST_RESULT,
  FP_COMP,
  CORE_RESULT,
} = require('utils/documentKeys');

var ASSEMBLY_ANALYSES = [ 'FP', 'MLST', 'PAARSNP', 'CORE' ];

var systemMetadataColumns = [
  'assemblyId', 'speciesId', 'assemblyName',
  'date', 'year', 'month', 'day',
  'position', 'latitude', 'longitude',
  'pmid',
  'filename', 'displayname',
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
    pmid: metadata.pmid,
    userDefined: filterUserDefinedColumns(metadata),
    metrics
  };
}

function beginUpload(ids, data, callback) {
  var assemblyMetadata = createMetadataRecord(ids, data.metadata, data.metrics);
  var assembly = {
    speciesId: ids.speciesId,
    assemblyId: ids.assemblyId,
    collectionId: ids.collectionId,
    sequences: data.sequences
  };

  async.parallel([
    done => mainStorage.store(
      createKey(ids.assemblyId, ASSEMBLY_METADATA),
      assemblyMetadata,
      done
    ),
    done => messageQueueService.newAssemblyUploadQueue(ids.assemblyId,
      function (uploadQueue) {
        uploadQueue.subscribe(function () {
          LOGGER.info(`Received response from ${uploadQueue.name}, destroying.`);
          uploadQueue.destroy();

          messageQueueService.getNotificationsExchange().publish(
            `${ids.speciesId}.UPLOAD.ASSEMBLY.${ids.assemblyId}`, {
              taskType: 'UPLOAD',
              taskStatus: 'SUCCESS',
              collectionId: ids.collectionId,
              assemblyId: {
                assemblyId: ids.assemblyId
              }
            }
          );

          done();
        });

        messageQueueService.getUploadExchange().publish(
          'upload', assembly, { replyTo: uploadQueue.name }
        );

        // "dereference" sequences to remove from heap
        data.sequences = null;
        assembly.sequences = null;
      }
    )
  ], callback);
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
  var mlst = assembly[MLST_RESULT];
  var core = assembly[CORE_RESULT];
  var fp = assembly[FP_COMP];
  return {
    populationSubtype: fp ? fp.subTypeAssignment : null,
    metadata: assembly[ASSEMBLY_METADATA],
    analysis: {
      st: mlst ? mlst.sequenceType : null,
      mlst: mlst ? mlst.code : null,
      core: core ? {
        size: core.kernelSize,
        percentMatched: core.percentKernelMatched,
      } : null,
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
    if (error) {
      return callback(error);
    }

    LOGGER.info('Got assembly ' + assemblyId + ' data');

    const assembly = mergeQueryResults(assemblyData, queryKeyPrefixes, assemblyId);

    sequenceTypeModel.addSequenceTypeData(
      assembly, params.speciesId, function (stError, result) {
        if (stError) {
          return callback(stError);
        }
        callback(null, formatForFrontend(result));
      }
    );
  });
}

const COMPLETE_ASSEMBLY_KEYS = [
  ASSEMBLY_METADATA,
  CORE_RESULT,
  FP_COMP,
  MLST_RESULT,
  PAARSNP_RESULT,
];
function getComplete(params, callback) {
  LOGGER.info('Getting assembly ' + params.assemblyId);
  get(params, COMPLETE_ASSEMBLY_KEYS, callback);
}

const REFERENCE_ASSEMBLY_KEYS = [
  ASSEMBLY_METADATA,
  MLST_RESULT,
  PAARSNP_RESULT,
];
function getReference(params, callback) {
  LOGGER.info('Getting reference assembly ' + params.assemblyId);
  get(params, REFERENCE_ASSEMBLY_KEYS, callback);
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

module.exports.ASSEMBLY_ANALYSES = ASSEMBLY_ANALYSES;
module.exports.beginUpload = beginUpload;
module.exports.getComplete = getComplete;
module.exports.getReference = getReference;
module.exports.groupAssembliesBySubtype = groupAssembliesBySubtype;
module.exports.createMetadataRecord = createMetadataRecord;
