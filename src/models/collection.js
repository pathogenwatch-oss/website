var async = require('async');

var assemblyModel = require('models/assembly');

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

// TODO: consider moving this to a properties file, fetch from db or cache
var S_AUREUS_TREE = '(04-02981:0.2470123195,(JH1:0.1162806302,JH9:0.12857532):0.2376870977,((((Mu3:0.08363516518,Mu50:0.08417907996):0.236362273,N315:0.1944329922):0.1869111513,(((((((USA300:0.1386320676,TCH1516:0.1419647298):0.405122317,NCTC8325:0.4014942735):0.01499047879,Newman:0.4122094277):1.833203686,((T0131:0.4351844888,TW20:0.432934413):0.009217126131,JKD6008:0.4294796659):2.488861602):1.513804015,((((LGA251:2.146778876,ED133:2.15659481):0.4394405593,Bovine RF122:2.84790413):0.3022622027,(((MRSA252:0.5772024212,TCH60:0.5648032066):3.246615194,ST398:3.296684309):0.9864464825,JKD6159:4.339195022):0.4081543768):1.38958245,EMRSA15:2.838719096):3.119334813):0.1644624611,(MSSA476:0.3476237534,MW2:0.3267886353):2.370979872):5.728829166,ED98:0.3502676606):0.2284923743):0.07743224229,ECT-R2:0.299692588):0.04901325688);';
var SALMONELLA_TREE = ''; // TODO: update with the salmonella tree data

var SPECIES_TREES = {
  1280: S_AUREUS_TREE,
  90370: SALMONELLA_TREE
};

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
  LOGGER.debug(speciesId, ids);
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
      var userAssemblyIdToAssemblyIdMap =
        results.assemblyIds.reduce(function (map, newId) {
          map[userAssemblyIds.shift()] = newId;
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
          userAssemblyIdToAssemblyIdMap: userAssemblyIdToAssemblyIdMap
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
      mainStorage.retrieve('COLLECTION_LIST_' + collectionId, done);
    },
    function (result, done) {
      var assemblyIds = result.assemblyIdentifiers;
      LOGGER.info('Got list of assemblies for collection ' + collectionId);
      async.reduce(assemblyIds, {}, function (memo, assemblyIdWrapper, next) {
        var assemblyId = assemblyIdWrapper.assemblyId || assemblyIdWrapper; // List format not yet defined
        var assemblyParams = {
          assemblyId: assemblyId,
          speciesId: speciesId
        };
        assemblyGetFn(assemblyParams, function (error, assembly) {
          if (error) {
            return next(error);
          }
          LOGGER.info('Got assembly ' + assemblyId);
          memo[assemblyId] = assembly;

          LOGGER.info((assemblyIds.length - Object.keys(memo).length) + ' assemblies left');
          next(null, memo);
        });
      }, done);
    }
  ], function (error, result) {
    if (error) {
      return callback(error, null);
    }
    callback(null, result);
  });
}

function getTree(suffix, callback) {
  var treeQueryKey = 'CORE_TREE_RESULT_' + suffix;
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
  async.forEachOf(taxonToSubtreeMap,
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
  getAssemblies(params, assemblyModel.getReference,
    function (error, assemblies) {
      if (error) {
        return callback(error, null);
      }

      callback(null, {
        collectionId: speciesId,
        assemblies: Object.keys(assemblies).reduce(function (memo, assemblyId) {
          memo[assemblyId.replace(speciesId + '_', '')] = assemblies[assemblyId];
          return memo;
        }, {}),
        tree: SPECIES_TREES[speciesId]
      });
    }
  );
}

module.exports.add = add;
module.exports.get = get;
module.exports.getReference = getReference;
