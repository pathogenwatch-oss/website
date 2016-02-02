var async = require('async');

var assemblyModel = require('models/assembly');

var mainStorage = require('services/storage')('main');
var messageQueueService = require('services/messageQueue');

var LOGGER = require('utils/logging').createLogger('Collection');
const { COLLECTION_LIST, CORE_TREE_RESULT } = require('utils/documentKeys');

var IDENTIFIER_TYPES = {
  COLLECTION: 'Collection',
  ASSEMBLY: 'Assembly'
};
var COLLECTION_OPERATIONS = {
  INITIATE: 'INITIATE_COLLECTION',
  EXTEND: 'EXTEND_COLLECTION',
  DELETE: 'DELETE_COLLECTION',
  DELETE_ASSEMBLIES: 'DELETE_ASSEMBLIES'
};
var COLLECTION_TREE_TASKS = [
  'PHYLO_MATRIX', 'SUBMATRIX', 'CORE_MUTANT_TREE'
];

function requestIDs(request, callback) {
  messageQueueService.newCollectionAddQueue(function (queue) {
    queue.subscribe(function (error, message) {
      if (error) {
        LOGGER.error(error);
        return callback(error, null);
      }
      LOGGER.info('Received response');
      queue.destroy();
      callback(null, message);
    });

    messageQueueService.getCollectionIdExchange()
      .publish('id-request', request, { replyTo: queue.name });
  });
}

function manageCollection(request, callback) {
  LOGGER.info(JSON.stringify(request));
  messageQueueService.newCollectionAddQueue(function (queue) {
    queue.subscribe(function (error, message) {
      if (error) {
        LOGGER.error(error);
        return callback(error, null);
      }
      LOGGER.info('Received response', message);
      queue.destroy();
      callback(null, request);
    });

    messageQueueService.getCollectionIdExchange()
      .publish('manage-collection', request, { replyTo: queue.name });
  });
}

function add(speciesId, { assemblyNames }, callback) {
  var collectionRequest = {
    identifierType: IDENTIFIER_TYPES.COLLECTION,
    count: 1
  };
  var assemblyRequest = {
    identifierType: IDENTIFIER_TYPES.ASSEMBLY,
    count: assemblyNames.length
  };

  LOGGER.info('Collection ids requested: ' + collectionRequest.count);
  LOGGER.info('Assembly ids requested: ' + assemblyRequest.count);

  async.waterfall([
    function (next) {
      async.parallel({
        collection: requestIDs.bind(null, collectionRequest),
        assembly: requestIDs.bind(null, assemblyRequest)
      }, next);
    },
    function (results, next) {
      LOGGER.info('Received IDs successfully:', results);
      manageCollection({
        collectionId: results.collection.identifiers[0],
        assemblyIds: results.assembly.identifiers,
        collectionOperation: COLLECTION_OPERATIONS.INITIATE
      }, next);
    },
  ],
  function (error, { collectionId, assemblyIds }) {
    if (error) {
      LOGGER.error(error);
      return callback(error);
    }

    const collectionSize = assemblyIds.length;
    const assemblyNameToAssemblyIdMap = assemblyIds.reduce((map, newId) => {
      map[assemblyNames.shift()] = newId;
      return map;
    }, {});

    const message = {
      collectionId,
      assemblyIdToNameMap: // reverse mapping allows name to be recovered for errors
        Object.keys(assemblyNameToAssemblyIdMap).reduce((map, name) => {
          map[assemblyNameToAssemblyIdMap[name]] = name;
          return map;
        }),
      collectionSize,
      expectedResults:
        collectionSize + // for upload notifications
        collectionSize * assemblyModel.ASSEMBLY_ANALYSES.length +
        COLLECTION_TREE_TASKS.length,
    };

    messageQueueService.getServicesExchange().publish(
      'upload-progress', message, null, function (notAcknowledged) {
        if (notAcknowledged) {
          const errorMessage = 'Upload progress service failed to acknowledge';
          LOGGER.error(errorMessage);
          return callback(new Error(errorMessage));
        }

        LOGGER.info('Received upload progress acknowledgement');
        callback(null, {
          collectionId,
          assemblyNameToAssemblyIdMap
        });
      }
    );
  });
}

function getAssemblyIds(collectionId, callback) {
  mainStorage.retrieve(`${COLLECTION_LIST}_${collectionId}`,
    function (error, result) {
      if (error) {
        return callback(error);
      }
      LOGGER.info('Got list of assemblies for collection ' + collectionId);
      return callback(null, result.assemblyIdentifiers);
    }
  );
}

function getAssemblies({ assemblyIds, speciesId }, assemblyGetFn, callback) {
  async.waterfall([
    function (done) {
      async.mapLimit(assemblyIds, 10, function (assemblyIdWrapper, finishMap) {
        // List items can be wrapped or raw value
        var assemblyId = assemblyIdWrapper.assemblyId || assemblyIdWrapper;
        var assemblyParams = {
          assemblyId: assemblyId,
          speciesId: speciesId
        };
        assemblyGetFn(assemblyParams, function (error, assembly) {
          if (error) {
            return finishMap(error);
          }
          LOGGER.info('Got assembly ' + assemblyId);
          finishMap(null, assembly);
        });
      }, done);
    }
  ], function (error, result) {
    if (error) {
      return callback(error, null);
    }
    callback(null, result.reduce(function (memo, assembly) {
      memo[assembly.metadata.assemblyId] = assembly;
      return memo;
    }, {}));
  });
}

function getTree(suffix, callback) {
  var treeQueryKey = `${CORE_TREE_RESULT}_${suffix}`;
  LOGGER.info('Getting tree with suffix: ' + suffix);
  mainStorage.retrieve(treeQueryKey, function (error, treeData) {
    if (error) {
      return callback(error, null);
    }
    LOGGER.info('Got ' + treeData.type + ' data with suffix ' + suffix);
    callback(null, treeData.newickTree);
  });
}

function get({ collectionId, speciesId }, callback) {
  LOGGER.info('Getting list of assemblies for collection ' + collectionId);

  async.waterfall([
    getAssemblyIds.bind(null, collectionId),
    function (assemblyIds, done) {
      const params = { speciesId, assemblyIds };
      async.parallel({
        assemblies: getAssemblies.bind(null, params, assemblyModel.getComplete),
        tree: getTree.bind(null, collectionId)
      }, done);
    }
  ], function (error, result) {
    if (error) {
      return callback(error, null);
    }
    callback(null, {
      collectionId,
      assemblies: result.assemblies,
      tree: result.tree,
      subtrees: assemblyModel.groupAssembliesBySubtype(result.assemblies)
    });
  });
}

function getReference(speciesId, callback) {
  LOGGER.info('Getting list of assemblies for species ' + speciesId);
  async.waterfall([
    getAssemblyIds.bind(null, speciesId),
    function (assemblyIds, done) {
      const params = { speciesId, assemblyIds };
      async.parallel({
        assemblies: getAssemblies.bind(null, params, assemblyModel.getReference),
        tree: getTree.bind(null, speciesId)
      }, done);
    }
  ], function (error, result) {
    if (error) {
      return callback(error, null);
    }

    callback(null, {
      collectionId: speciesId,
      assemblies: result.assemblies,
      tree: result.tree
    });
  });
}

function getSubtree({ speciesId, collectionId, subtreeId }, callback) {
  async.waterfall([
    getAssemblyIds.bind(null, subtreeId),
    function (assemblyIdWrappers, done) {
      const params = {
        speciesId,
        assemblyIds: assemblyIdWrappers.filter(
          wrapper => (wrapper.assemblyId || wrapper) !== subtreeId
        )
      };
      async.parallel({
        assemblies: getAssemblies.bind(null, params, assemblyModel.getComplete),
        tree: getTree.bind(null, `${collectionId}_${subtreeId}`)
      }, done);
    }
  ], function (error, result) {
    if (error) {
      return callback(error, null);
    }
    callback(null, {
      name: subtreeId,
      assemblies: result.assemblies,
      tree: result.tree,
    });
  });
}

module.exports.add = add;
module.exports.get = get;
module.exports.getReference = getReference;
module.exports.getSubtree = getSubtree;
