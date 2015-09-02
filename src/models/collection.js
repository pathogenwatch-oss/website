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

var SPECIES_TREES = {
  1280: '(04-02981:0.2470123195,(JH1:0.1162806302,JH9:0.12857532):0.2376870977,((((Mu3:0.08363516518,Mu50:0.08417907996):0.236362273,N315:0.1944329922):0.1869111513,(((((((USA300:0.1386320676,TCH1516:0.1419647298):0.405122317,NCTC8325:0.4014942735):0.01499047879,Newman:0.4122094277):1.833203686,((T0131:0.4351844888,TW20:0.432934413):0.009217126131,JKD6008:0.4294796659):2.488861602):1.513804015,((((LGA251:2.146778876,ED133:2.15659481):0.4394405593,Bovine RF122:2.84790413):0.3022622027,(((MRSA252:0.5772024212,TCH60:0.5648032066):3.246615194,ST398:3.296684309):0.9864464825,JKD6159:4.339195022):0.4081543768):1.38958245,EMRSA15:2.838719096):3.119334813):0.1644624611,(MSSA476:0.3476237534,MW2:0.3267886353):2.370979872):5.728829166,ED98:0.3502676606):0.2284923743):0.07743224229,ECT-R2:0.299692588):0.04901325688);',
  90370: '((((((002168.fa:74.3,LNT1148.fa:48.7):88.45833333333333,H12ESR00755-001A.fa:109.04166666666667):107.81770833333333,(((((007898.fa:9.863636363636363,P-stx-12.fa:8.136363636363637):80.51785714285714,Ty2.fa:65.48214285714286):71.23076923076923,ERL072973.fa:52.769230769230774):78.2215909090909,(ERL024919.fa:0.5238095238095237,H12ESR00394-001A.fa:14.476190476190476):81.6534090909091):99.4,(404Ty.fa:85.83333333333333,Quailes.fa:66.16666666666667):106.6):95.05729166666667):94.677734375,(CT18.fa:182.3,(ERL041834.fa:46.71875,H12ESR04734-001A.fa:86.28125):87.69999999999999):176.509765625):168.4453125,(((11909_3.fa:45.64,E98-3139.fa:4.359999999999999):156.21428571428572,(ERL024120.fa:39.979166666666664,M223.fa:18.020833333333336):164.78571428571428):170.5078125,((D50739.fa:99.25,LNT1360.fa:67.75):112.34375,E98_0664.fa:114.15625):127.6171875):144.33984375):205.126953125,((76-1292.fa:358.0657894736842,(E00-7866.fa:181.7826086956522,E02-1180.fa:176.2173913043478):256.9342105263158):343.4583333333333,((80-2002.fa:52.325,ERL114000.fa:53.675):74.89705882352942,ERL103914.fa:117.10294117647058):121.66666666666669):205.126953125);'
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
