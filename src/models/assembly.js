const metadataModel = require('models/assemblyMetadata');
const sequenceTypeModel = require('models/sequenceType');
const messageQueueService = require('services/messageQueue');
const mainStorage = require('services/storage')('main');

const LOGGER = require('utils/logging').createLogger('Assembly');
const {
  ASSEMBLY_METADATA,
  PAARSNP_RESULT,
  MLST_RESULT,
  FP_COMP,
  CORE_RESULT,
} = require('utils/documentKeys');

const ASSEMBLY_ANALYSES = [ 'FP', 'MLST', 'PAARSNP', 'CORE' ];

function retrieveManyPromise(keys) {
  return new Promise((resolve, reject) => {
    mainStorage.retrieveMany(keys, (error, results) => {
      if (error) return reject(error);
      return resolve(results);
    });
  });
}

exports.getAssemblies = function (assemblyIds) {
  const documentKeys = assemblyIds.map(id => `WGSA_${id}`);
  return retrieveManyPromise(documentKeys).
    then(results =>
      assemblyIds.reduce((memo, id, index) => {
        memo[id] = results[documentKeys[index]];
        return memo;
      }, {})
    );
};

function sendUploadNotification({ speciesId, collectionId, assemblyId }, status) {
  messageQueueService.getNotificationExchange().publish(
    `${speciesId}.UPLOAD.ASSEMBLY.${assemblyId}`, {
      taskType: 'UPLOAD',
      taskStatus: status,
      collectionId,
      assemblyId: {
        assemblyId,
      },
    }
  );
}

function createKey(id, prefix) {
  return prefix + '_' + id;
}


function beginUpload(ids, data) {
  var assemblyMetadata = metadataModel.createRecord(ids, data.metadata, data.metrics);
  var assembly = {
    speciesId: ids.speciesId,
    assemblyId: ids.assemblyId,
    collectionId: ids.collectionId,
    sequences: data.sequences,
  };

  mainStorage.store(
    createKey(ids.assemblyId, ASSEMBLY_METADATA), assemblyMetadata, () => {});

  messageQueueService.newAssemblyUploadQueue(ids.assemblyId, uploadQueue => {
    uploadQueue.subscribe((error, message) => {
      LOGGER.debug(error, message);
      LOGGER.info(`Received response from ${uploadQueue.name}, destroying.`);
      uploadQueue.destroy();

      sendUploadNotification(ids, error ? 'ERROR' : 'SUCCESS');
    });

    messageQueueService.getUploadExchange().publish(
      'upload', assembly, { replyTo: uploadQueue.name }
    );

    // "dereference" sequences to remove from heap
    data.sequences = null;
    assembly.sequences = null;
  });
}

function constructQueryKeys(prefixes, assemblyId) {
  return prefixes.map(createKey.bind(null, assemblyId));
}

function mergeQueryResults(data, queryKeyPrefixes, assemblyId) {
  return queryKeyPrefixes.reduce((assembly, key) => {
    assembly[key] = data[createKey(assemblyId, key)];
    return assembly;
  }, { assemblyId });
}

function formatForFrontend(assembly) {
  const paarsnp = assembly[PAARSNP_RESULT];
  const mlst = assembly[MLST_RESULT];
  const core = assembly[CORE_RESULT];
  const fp = assembly[FP_COMP];
  return {
    metadata: assembly[ASSEMBLY_METADATA],
    analysis: {
      populationSubtype: fp ? fp.subTypeAssignment : null,
      st: mlst ? mlst.sequenceType : null,
      mlst: mlst ? mlst.code : null,
      core: core ? {
        size: core.kernelSize,
        percentMatched: core.percentKernelMatched,
        percentAssemblyMatched: core.percentAssemblyMatched,
      } : null,
      resistanceProfile: paarsnp ?
        paarsnp.antibioticProfiles.reduce(
          (memo, { name, resistanceState, resistanceSets }) => {
            memo[name] = {
              name,
              state: resistanceState,
              mechanisms: resistanceSets.map(_ => _.resistanceSetName),
            };
            return memo;
          }, {}
        ) : {},
    },
  };
}

function hasFatalErrors(erroredKeys) {
  return erroredKeys.some(key =>
    key.startsWith(ASSEMBLY_METADATA) ||
    key.startsWith(CORE_RESULT) ||
    key.startsWith(FP_COMP)
  );
}

function get(params, queryKeyPrefixes, callback) {
  var assemblyId = params.assemblyId;
  var queryKeys = constructQueryKeys(queryKeyPrefixes, assemblyId);

  LOGGER.info('Assembly ' + assemblyId + ' query keys:');
  LOGGER.info(queryKeys);

  mainStorage.retrieveMany(queryKeys, function (erroredKeys, assemblyData) {
    if (erroredKeys && hasFatalErrors(erroredKeys)) {
      LOGGER.error(`Could retrieve minimum documents for assembly ${assemblyId}`);
      return callback(erroredKeys);
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
  CORE_RESULT,
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
module.exports.sendUploadNotification = sendUploadNotification;
