const async = require('async');

const assemblyModel = require('models/assembly');

const mainStorage = require('services/storage')('main');
const messageQueueService = require('services/messageQueue');

const fastaStorage = require('wgsa-fasta-store');
const { fastaStoragePath } = require('configuration');

const LOGGER = require('utils/logging').createLogger('Collection');
const { COLLECTION_LIST, CORE_TREE_RESULT, COLLECTION_METADATA } =
  require('utils/documentKeys');

const COLLECTION_OPERATIONS = {
  CREATE: 'CREATE',
};

function manageCollection(request) {
  LOGGER.info(JSON.stringify(request));
  return new Promise((resolve, reject) => {
    messageQueueService.newCollectionAddQueue(queue => {
      queue.subscribe((error, message) => {
        if (error) {
          LOGGER.error(error);
          return reject(error);
        }
        LOGGER.info('Received response', message);
        queue.destroy();

        const { collectionId, assemblyIds, status } = message;
        if (!collectionId || !assemblyIds || status !== 'SUCCESS') {
          LOGGER.error('Invalid result of manageCollection');
          return reject();
        }

        resolve(message);
      });

      messageQueueService.getCollectionIdExchange()
        .publish('manage-collection', request, { replyTo: queue.name });
    });
  });
}

function notifyUploadProgress({ speciesId, collectionId, assemblyIds, files }) {
  const collectionSize = files.length;
  const assemblyIdToNameMap = files.reduce((memo, { id, name }) => {
    memo[assemblyIds[id]] = name;
    return memo;
  }, {});

  const message = {
    collectionId,
    speciesId,
    assemblyIdToNameMap,
    collectionSize,
  };

  return new Promise((resolve, reject) => {
    messageQueueService.newUploadProgressRequestQueue(collectionId, queue => {
      queue.subscribe(ackError => {
        if (ackError) {
          LOGGER.error('Upload progress service failed to acknowledge');
          return reject(ackError);
        }

        LOGGER.info('Received upload progress acknowledgement');
        queue.destroy();
        resolve();
      });

      messageQueueService.getServicesExchange().publish('upload-progress', message);
    });
  });
}

function submitAssemblies({ speciesId, collectionId, assemblyIds, files }) {
  const uploads =
    files.map(file => {
      const { id, name, metadata = { assemblyName: name }, metrics } = file;
      const assemblyId = assemblyIds[id];
      return (
        fastaStorage.retrieve(fastaStoragePath, id).
          then(sequences =>
            assemblyModel.submit(
              { speciesId, collectionId, assemblyId },
              { sequences, metadata, metrics }
            )
          )
      );
    });

  return Promise.all(uploads);
}

function add({ speciesId, files }) {
  LOGGER.info(`Creating collection of species ${speciesId} with ${files.length} files`);

  return manageCollection({
    fileIds: files.map(_ => _.id),
    collectionOperation: COLLECTION_OPERATIONS.CREATE,
  }).then(({ collectionId, assemblyIds }) => {
    const args = { speciesId, collectionId, assemblyIds, files };
    return notifyUploadProgress(args).then(() => submitAssemblies(args));
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
          assemblyId,
          speciesId,
        };
        assemblyGetFn(assemblyParams, function (error, assembly) {
          if (error) {
            return finishMap(error);
          }
          LOGGER.info('Got assembly ' + assemblyId);
          finishMap(null, assembly);
        });
      }, done);
    },
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
        tree: getTree.bind(null, collectionId),
      }, function (error, result) {
        if (error) {
          return done(error);
        }

        done(null, {
          collectionId,
          assemblies,
          tree: result.tree,
          subtrees: result.subtrees,
        });
      });
    },
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
        tree: getTree.bind(null, speciesId),
      }, done);
    },
  ], function (error, result) {
    if (error) {
      return callback(error, null);
    }

    callback(null, {
      collectionId: speciesId,
      assemblies: result.assemblies,
      tree: result.tree,
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
        ),
      };
      async.parallel({
        assemblies: getAssemblies.bind(null, params, assemblyModel.getComplete),
        tree: getTree.bind(null, `${collectionId}_${subtreeId}`),
      }, done);
    },
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

function getStatus({ speciesId, collectionId }, callback) {
  mainStorage.retrieve(`${COLLECTION_METADATA}_${collectionId}`, function (error, doc, cas) {
    if (error) {
      return callback(error);
    }

    if (doc.speciesId && speciesId !== doc.speciesId) {
      return callback(new Error('Species does not match'));
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
module.exports.getAssemblyIds = getAssemblyIds;
module.exports.get = get;
module.exports.getReference = getReference;
module.exports.getSubtree = getSubtree;
module.exports.getStatus = getStatus;
