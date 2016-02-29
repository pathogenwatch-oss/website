var async = require('async');

var assemblyModel = require('models/assembly');

var mainStorage = require('services/storage')('main');
var messageQueueService = require('services/messageQueue');

var LOGGER = require('utils/logging').createLogger('Collection');
const { COLLECTION_LIST, CORE_TREE_RESULT, COLLECTION_METADATA } = require('utils/documentKeys');

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
        }, {}),
      collectionSize,
    };

    messageQueueService.newUploadProgressRequestQueue(collectionId, queue => {
      queue.subscribe(ackError => {
        if (ackError) {
          LOGGER.error('Upload progress service failed to acknowledge');
          return callback(ackError);
        }

        LOGGER.info('Received upload progress acknowledgement');
        queue.destroy();
        callback(null, {
          collectionId,
          assemblyNameToAssemblyIdMap
        });
      });

      messageQueueService.getServicesExchange().publish('upload-progress', message);
    });
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

function addPublicAssemblyCounts(subtrees, collectionId, callback) {
  const subtreeIds = Object.keys(subtrees);
  const documentKeys =
    subtreeIds.map(id => `${CORE_TREE_RESULT}_${collectionId}_${id}`);
  LOGGER.info(`Getting public assembly counts for subtrees: ${subtreeIds}`);
  mainStorage.retrieveMany(
    documentKeys,
    (error, results) => {
      if (error) {
        return callback(error);
      }
      documentKeys.forEach((key, i) => {
        const { leafIdentifiers } = results[key];
        const subtreeId = subtreeIds[i];
        const subtree = subtrees[subtreeId];
        const collectionAssemblyIds = new Set(subtree.assemblyIds);
        subtree.publicCount = leafIdentifiers.filter(
          id => id !== subtreeId && !collectionAssemblyIds.has(id)
        ).length;
      });
      callback(null, subtrees);
    }
  );
}

function get({ collectionId, speciesId }, callback) {
  LOGGER.info('Getting list of assemblies for collection ' + collectionId);
  async.waterfall([
    getAssemblyIds.bind(null, collectionId),
    function (assemblyIds, done) {
      const params = { speciesId, assemblyIds };
      getAssemblies(params, assemblyModel.getComplete, done);
    },
    function (assemblies, done) {
      const subtrees = assemblyModel.groupAssembliesBySubtype(assemblies);
      async.parallel({
        subtrees: addPublicAssemblyCounts.bind(null, subtrees, collectionId),
        tree: getTree.bind(null, collectionId)
      }, function (error, result) {
        if (error) {
          return done(error);
        }

        done(null, {
          collectionId,
          assemblies,
          tree: result.tree,
          subtrees: result.subtrees
        });
      });
    }
  ], function (error, result) {
    if (error) {
      LOGGER.error(error);
      return callback(error);
    }
    callback(null, result);
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
    async.parallel.bind(null, {
      subtree: getAssemblyIds.bind(null, subtreeId),
      collection: getAssemblyIds.bind(null, collectionId),
    }),
    function ({ subtree, collection }, done) {
      const subtreeAssemblyIds = subtree.map(_ => _.assemblyId);
      const collectionAssemblyIds = new Set(collection.map(_ => _.assemblyId));
      const params = {
        speciesId,
        assemblyIds: subtreeAssemblyIds.filter(
          id => id !== subtreeId && !collectionAssemblyIds.has(id)
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

function getStatus({ collectionId }, callback) {
  mainStorage.retrieve(`${COLLECTION_METADATA}_${collectionId}`, function (error, doc, cas) {
    if (error) {
      return callback(error);
    }

    if (doc.status === 'READY') {
      return callback(null, { status: 'READY' });
    }

    // status page doesn't need this data
    delete doc.assemblyIdToNameMap;
    delete doc.type;
    delete doc.documentKey;

    // status is moved outside of progress doc
    const status = doc.status;
    delete doc.status;

    return callback(null, { status, progress: doc, cas });
  });
}

module.exports.add = add;
module.exports.get = get;
module.exports.getReference = getReference;
module.exports.getSubtree = getSubtree;
module.exports.getStatus = getStatus;
