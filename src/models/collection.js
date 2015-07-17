var async = require('async');

var assemblyModel = require('models/assembly');
var antibioticModel = require('models/antibiotic');
var mainStorage = require('services/storage')('main');
var messageQueueService = require('services/messageQueue');
var socketService = require('services/socket');

var LOGGER = require('utils/logging').createLogger('Collection');
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
      callback(null, message);
    });

    messageQueueService.getCollectionIdExchange()
      .publish('manage-collection', request, { replyTo: queue.name });
  });
}

function add(ids, callback) {
  var userAssemblyIds = ids.userAssemblyIds;

  var collectionRequest = {
    identifierType: IDENTIFIER_TYPES.COLLECTION,
    count: 1
  };
  var assemblyRequest = {
    identifierType: IDENTIFIER_TYPES.ASSEMBLY,
    count: userAssemblyIds.length
  };
  LOGGER.info('Collection ids requested: ' + collectionRequest.count);
  LOGGER.info('Assembly ids requested: ' + assemblyRequest.count);

  async.parallel({
    collection: requestIDs.bind(null, collectionRequest),
    assembly: requestIDs.bind(null, assemblyRequest)
  }, function (error, results) {
    if (error) {
      LOGGER.error(error);
      return callback(error, null);
    }
    LOGGER.info('Received IDs successfully:', results);
    manageCollection({
      collectionId: results.collection.identifiers[0],
      assemblyIds: results.assembly.identifiers,
      collectionOperation: COLLECTION_OPERATIONS.INITIATE
    }, function (initiateError) {
      if (initiateError) {
        LOGGER.error(initiateError);
        return callback(initiateError, null);
      }
      var collectionId = results.collection.identifiers[0];
      var userAssemblyIdToAssemblyIdMap =
        results.assembly.identifiers.reduce(function (map, newId) {
          map[userAssemblyIds.shift()] = newId;
          return map;
        }, {});

      ids.collectionId = collectionId;

      messageQueueService.newCollectionNotificationQueue(ids, function (queue) {
        var expectedResults = COLLECTION_TREE_TASKS.map(function (task) { return task; });

        queue.subscribe(function (error, message) {
          if (error) {
            return LOGGER.error(error);
          }

          var taskType = message.taskType;
          if (expectedResults.indexOf(taskType) === -1) {
            return LOGGER.warn('Skipping task: ' + taskType);
          }

          LOGGER.info(
            'Received notification for collection ' + collectionId + ': ' + taskType
          );

          socketService.notifyCollectionUpload(ids, taskType);
          expectedResults.splice(message.taskType, 1);

          LOGGER.info(
            'Remaining tasks for collection ' + collectionId + ': ' + expectedResults
          );

          if (expectedResults.length === 0) {
            LOGGER.info(
              'Collection ' + collectionId + ' tasks completed, destroying ' +
                queue.name
            );
            queue.destroy();
          }
        });

        callback(null, {
          collectionId: collectionId,
          userAssemblyIdToAssemblyIdMap: userAssemblyIdToAssemblyIdMap
        });
      });
    });
  });
}

function getAssemblies(collectionId, callback) {
  var assemblies = {};
  mainStorage.retrieve('COLLECTION_LIST_' + collectionId,
    function (error, result) {
      if (error) {
        return callback(error, null);
      }
      var assemblyIds = result.assemblyIdentifiers;
      LOGGER.info('Got list of assemblies for collection ' + collectionId);
      async.each(
        assemblyIds,
        function (assemblyId, finishIteration) {
          assemblyModel.getComplete(assemblyId, function (error, assembly) {
            if (error) {
              return finishIteration(error);
            }
            LOGGER.info('Got assembly ' + assemblyId);
            assemblies[assemblyId] = assembly;

            var numRemaining =
              assemblyIds.length - Object.keys(assemblies).length;
            LOGGER.info(numRemaining + ' assemblies left');
            finishIteration();
          });
        },
        function (error) {
          if (error) {
            return callback(error, null);
          }
          callback(null, assemblies);
        }
      );
    }
  );
}

function getTree(collectionId, callback) {
  LOGGER.info('Getting tree for collection id: ' + collectionId);
  var treeQueryKey = 'CORE_TREE_RESULT_' + collectionId;

  mainStorage.retrieve(treeQueryKey, function (error, treeData) {
    if (error) {
      return callback(error, null);
    }
    var tree = {};
    LOGGER.info(
      'Got ' + treeData.type + ' data for ' + collectionId + ' collection'
    );
    tree[treeData.type] = {
      name: 'Core Mutations Tree',
      data: treeData.newickTree
    };
    callback(null, tree);
  });
}

function get(collectionId, callback) {
  LOGGER.info('Getting list of assemblies for collection ' + collectionId);

  async.parallel({
    assemblies: getAssemblies.bind(null, collectionId),
    tree: getTree.bind(null, collectionId),
    antibiotics: antibioticModel.getAll
  }, function (error, result) {
    if (error) {
      return callback(error, null);
    }
    callback(null, {
      collection: {
        assemblies: result.assemblies,
        tree: result.tree
      },
      antibiotics: result.antibiotics
    });
  });
}

function getRepresentativeCollection(callback) {
  LOGGER.info('Getting representative collection');

  mainStorage.retrieve('REP_METADATA_1280',
    function (error, representativeCollectionMetadata) {
      if (error) {
        return callback(error, null);
      }
      LOGGER.info('Got representative collection');
      callback(null, representativeCollectionMetadata);
    }
  );
}

function getMergedCollectionTree(mergedTreeId, callback) {
  LOGGER.info('Getting merged tree ' + mergedTreeId);

  mainStorage.retrieve(mergedTreeId, function (error, treeData) {
    if (error) {
      return callback(error, null);
    }
    LOGGER.info('Got merged tree ' + mergedTreeId);
    callback(null, treeData);
  });
}

function mergeCollectionTrees(ids) {
  LOGGER.info('Merging trees');

  var mergeRequest = {
    assemblies: [],
    targetCollectionId: ids.collectionId, // Your collection id
    inputData: [ids.mergeWithCollectionId], // e.g.: EARSS collection, etc.
    dataSource: 'CORE'
  };

  messageQueueService.newMergeTreesNotificationQueue(ids.collectionId,
    function (queue) {
      queue.subscribe(function (error, message) {
        LOGGER.info('Received notification message: ' + message);
        queue.destroy();

        ids.mergedTreeId = message.documentKeys[0];

        getMergedCollectionTree(ids.mergedTreeId, function (error, mergedTree) {
          if (error) {
            LOGGER.error(error);
            return;
          }
          if (message.taskType === 'MERGE') {
            socketService.notifyTreeMergeRequest(ids, mergedTree, mergeRequest);
          }
        });
      });

      messageQueueService.getTasksExchange()
        .publish('merge-trees', mergeRequest, { replyTo: 'noQueueId' });
    }
  );
}

function getMergeTree(ids) {
  var mergeTreeKey = 'MERGE_TREE_' + ids.mergeTreeId;
  getMergedCollectionTree(mergeTreeKey, function (error, mergeTree) {
    if (error) {
      LOGGER.error(error);
      return;
    }
    socketService.notifyTreeMerge(ids, mergeTree);
  });
}

module.exports.add = add;
module.exports.get = get;
module.exports.getRepresentativeCollection = getRepresentativeCollection;
module.exports.mergeCollectionTrees = mergeCollectionTrees;
module.exports.getMergeTree = getMergeTree;
