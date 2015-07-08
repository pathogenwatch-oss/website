var async = require('async');

var assemblyModel = require('models/assembly');
var antibioticModel = require('models/antibiotic');
var mainStorage = require('services/storage')('main');
var messageQueueService = require('services/messageQueue');
var socketService = require('services/socket');

var LOGGER = require('utils/logging').createLogger('Collection');
var NEW_COLLECTION_TASK_ID = 'new';

function add(collectionId, userAssemblyIds, callback) {
  var collectionRequest = {
    taskId: collectionId || NEW_COLLECTION_TASK_ID,
    inputData: userAssemblyIds
  };
  LOGGER.info('Collection request taskId: ' + collectionRequest.taskId);
  LOGGER.info('Collection request inputData: ' + collectionRequest.inputData);
  messageQueueService.newCollectionAddQueue(function (queue) {
    queue.subscribe(function (error, message) {
      if (error) {
        LOGGER.error(error);
        return callback(error, null);
      }
      LOGGER.info('Received response');
      callback(null, {
        collectionId: message.uuid,
        userAssemblyIdToAssemblyIdMap: message.idMap
      });
    });

    messageQueueService.getCollectionIdExchange()
      .publish('id-request', collectionRequest, { replyTo: queue.name });
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
