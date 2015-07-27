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
        function (assemblyIdWrapper, finishIteration) {
          var assemblyId = assemblyIdWrapper.assemblyId;
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

function getTree(suffix, callback) {
  LOGGER.info('Getting tree with suffix: ' + suffix);
  var treeQueryKey = 'CORE_TREE_RESULT_' + suffix;

  mainStorage.retrieve(treeQueryKey, function (error, treeData) {
    if (error) {
      return callback(error, null);
    }
    LOGGER.info(
      'Got ' + treeData.type + ' data with suffix ' + suffix
    );
    callback(null, treeData.newickTree);
  });
}

function getSubtrees(assemblyIdToTaxonMap, collectionId, callback) {
  async.reduce(Object.keys(assemblyIdToTaxonMap), {},
    function (memo, assemblyId, done) {
      var taxon = assemblyIdToTaxonMap[assemblyId];
      getTree(collectionId + '_' + taxon, function (error, newickTree) {
        memo[taxon] = newickTree;
        done(error, memo);
      });
    }, callback);
}

function formatForFrontend(assemblies) {
  return Object.keys(assemblies).reduce(function (memo, assemblyId) {
    var assemblyData = assemblies[assemblyId];
    memo[assemblyId] = {
      metadata: assemblyData.ASSEMBLY_METADATA,
      analysis: {
        st: assemblyData.MLST_RESULT.stType,
        resistanceProfile:
          Object.keys(assemblyData.PAARSNP_RESULT.resistanceProfile).reduce(function (profile, className) {
            var antibioticClass = assemblyData.PAARSNP_RESULT.resistanceProfile[className];
            Object.keys(antibioticClass).forEach(function (antibiotic) {
              profile[antibiotic] = {
                antibioticClass: className,
                resistanceResult: antibioticClass[antibiotic]
              };
            });
            return profile;
          }, {})
      }
    };
    return memo;
  }, {});
}

function get(collectionId, callback) {
  LOGGER.info('Getting list of assemblies for collection ' + collectionId);

  async.waterfall([
    function (done) {
      async.parallel({
        assemblies: getAssemblies.bind(null, collectionId),
        tree: getTree.bind(null, collectionId),
        antibiotics: antibioticModel.getAll
      }, done);
    },
    function (result, done) {
      var assemblyIdToTaxonMap = assemblyModel.mapAssembliesToTaxa(result.assemblies);
      getSubtrees(assemblyIdToTaxonMap, collectionId, function (error, subtrees) {
        result.assemblyIdToTaxonMap = assemblyIdToTaxonMap;
        result.subtrees = subtrees;
        done(error, result);
      });
    }
  ], function (error, result) {
    if (error) {
      return callback(error, null);
    }
    callback(null, {
      collection: {
        collectionId: collectionId,
        assemblies: formatForFrontend(result.assemblies),
        tree: result.tree,
        assemblyIdMap: result.assemblyIdToTaxonMap,
        subtrees: result.subtrees
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
    inputData: [ ids.mergeWithCollectionId ], // e.g.: EARSS collection, etc.
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

function getReferenceAssemblies(speciesId, callback) {
  var assemblies = {};
  mainStorage.retrieve('COLLECTION_LIST_' + speciesId,
    function (error, result) {
      if (error) {
        return callback(error, null);
      }
      var assemblyIds = result.assemblyIdentifiers;
      LOGGER.info('Got list of assemblies for species ' + speciesId);
      async.eachSeries(
        assemblyIds,
        function (assemblyId, finishIteration) {
          assemblyModel.getReference(speciesId, assemblyId, function (error, assembly) {
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

function mapReferenceAssembliesToTaxa(assemblies) {
  return Object.keys(assemblies).reduce(function (map, assemblyId) {
    map[assemblyId] = assemblyId;
    return map;
  }, {});
}

function getReferenceCollection(speciesId, callback) {
  LOGGER.info('Getting list of assemblies for species ' + speciesId);

  getReferenceAssemblies(speciesId, function (error, assemblies) {
    if (error) {
      return callback(error, null);
    }
    callback(null, {
      collection: {
        collectionId: '1280',
        assemblies: formatForFrontend(assemblies),
        tree: '(04-02981:0.2470123195,(JH1:0.1162806302,JH9:0.12857532):0.2376870977,((((Mu3:0.08363516518,Mu50:0.08417907996):0.236362273,N315:0.1944329922):0.1869111513,(((((((USA300:0.1386320676,TCH1516:0.1419647298):0.405122317,NCTC8325:0.4014942735):0.01499047879,Newman:0.4122094277):1.833203686,((T0131:0.4351844888,TW20:0.432934413):0.009217126131,JKD6008:0.4294796659):2.488861602):1.513804015,((((LGA251:2.146778876,ED133:2.15659481):0.4394405593,Bovine RF122:2.84790413):0.3022622027,(((MRSA252:0.5772024212,TCH60:0.5648032066):3.246615194,ST398:3.296684309):0.9864464825,JKD6159:4.339195022):0.4081543768):1.38958245,EMRSA15:2.838719096):3.119334813):0.1644624611,(MSSA476:0.3476237534,MW2:0.3267886353):2.370979872):5.728829166,ED98:0.3502676606):0.2284923743):0.07743224229,ECT-R2:0.299692588):0.04901325688);',
        assemblyIdMap: mapReferenceAssembliesToTaxa(assemblies)
      }
    });
  });
}

module.exports.add = add;
module.exports.get = get;
module.exports.getRepresentativeCollection = getRepresentativeCollection;
module.exports.mergeCollectionTrees = mergeCollectionTrees;
module.exports.getMergeTree = getMergeTree;
module.exports.getReferenceCollection = getReferenceCollection;
