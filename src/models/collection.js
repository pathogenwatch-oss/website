var async = require('async');

var assemblyModel = require('models/assembly');

var mainStorage = require('services/storage')('main');
var messageQueueService = require('services/messageQueue');
var socketService = require('services/socket');

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

function add(speciesId, ids, callback) {
  var assemblyNames = ids.assemblyNames;
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
    function (done) {
      async.parallel({
        collection: requestIDs.bind(null, collectionRequest),
        assembly: requestIDs.bind(null, assemblyRequest)
      }, done);
    },
    function (results, done) {
      LOGGER.info('Received IDs successfully:', results);
      manageCollection({
        collectionId: results.collection.identifiers[0],
        assemblyIds: results.assembly.identifiers,
        collectionOperation: COLLECTION_OPERATIONS.INITIATE
      }, done);
    },
    function (results, done) {
      var assemblyNameToAssemblyIdMap =
        results.assemblyIds.reduce(function (map, newId) {
          map[assemblyNames.shift()] = newId;
          return map;
        }, {});

      ids.collectionId = results.collectionId;
      ids.speciesId = speciesId;

      messageQueueService.newCollectionNotificationQueue(ids, {
        tasks: COLLECTION_TREE_TASKS,
        loggingId: 'Collection ' + ids.collectionId,
        notifyFn: socketService.notifyCollectionUpload.bind(socketService, ids)
      }, function () {
        done(null, {
          collectionId: ids.collectionId,
          assemblyNameToAssemblyIdMap: assemblyNameToAssemblyIdMap
        });
      });
    }
  ],
  function (error, result) {
    if (error) {
      LOGGER.error(error);
      return callback(error, null);
    }
    callback(null, result);
  });
}

function getAssemblies(params, assemblyGetFn, callback) {
  var collectionId = params.collectionId;
  var speciesId = params.speciesId;

  async.waterfall([
    function (done) {
      mainStorage.retrieve(`${COLLECTION_LIST}_${collectionId}`, done);
    },
    function (result, done) {
      var assemblyIds = result.assemblyIdentifiers;
      LOGGER.info('Got list of assemblies for collection ' + collectionId);
      async.mapLimit(assemblyIds, 10, function (assemblyIdWrapper, finishMap) {
        var assemblyId = assemblyIdWrapper.assemblyId || assemblyIdWrapper; // List format varies between wrapped and raw value
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

function getSubtrees(taxonToSubtreeMap, collectionId, callback) {
  async.forEachOfLimit(
    taxonToSubtreeMap, 10,
    function (subtree, taxon, done) {
      getTree(collectionId + '_' + taxon, function (error, newickTree) {
        if (error) {
          return done(error);
        }
        subtree.newick = newickTree;
        done();
      });
    }, callback);
}

function get(params, callback) {
  var collectionId = params.collectionId;
  LOGGER.info('Getting list of assemblies for collection ' + collectionId);

  async.waterfall([
    function (done) {
      async.parallel({
        assemblies: getAssemblies.bind(null, params, assemblyModel.getComplete),
        tree: getTree.bind(null, collectionId)
      }, done);
    },
    function (result, done) {
      var subtreeMap = assemblyModel.mapTaxaToAssemblies(result.assemblies);
      getSubtrees(subtreeMap, collectionId, function (error) {
        result.subtrees = subtreeMap;
        done(error, result);
      });
    }
  ], function (error, result) {
    if (error) {
      return callback(error, null);
    }
    callback(null, {
      collectionId: collectionId,
      assemblies: result.assemblies,
      tree: result.tree,
      subtrees: result.subtrees
    });
  });
}

function getReference(speciesId, callback) {
  var params = {
    collectionId: speciesId,
    speciesId: speciesId
  };

  LOGGER.info('Getting list of assemblies for species ' + speciesId);
  async.parallel({
    assemblies: getAssemblies.bind(null, params, assemblyModel.getReference),
    tree: getTree.bind(null, speciesId)
  }, function (error, result) {
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

module.exports.add = add;
module.exports.get = get;
module.exports.getReference = getReference;
