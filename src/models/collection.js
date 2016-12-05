const async = require('async');

const assemblyModel = require('./assembly');

const mainStorage = require('services/storage')('main');

const LOGGER = require('utils/logging').createLogger('Collection');
const { COLLECTION_LIST, CORE_TREE_RESULT, COLLECTION_METADATA } =
  require('utils/documentKeys');

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
      async.mapLimit(assemblyIds, 50, function (assemblyIdWrapper, finishMap) {
        // List items can be wrapped or raw value
        var assemblyId = assemblyIdWrapper.uuid || assemblyIdWrapper;
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

function getMetadata(collectionId, callback) {
  return (
    mainStorage.retrieve(`${COLLECTION_METADATA}_${collectionId}`,
      (error, result) => callback(error, result)
    )
  );
}

function get({ collectionId, speciesId }, callback) {
  LOGGER.info(`Getting list of assemblies for collection ${collectionId}`);
  async.waterfall([
    getMetadata.bind(null, collectionId),
    function (metadata, done) {
      const assemblyIds = Object.keys(metadata.assemblyIdToNameMap);
      const params = { speciesId, assemblyIds };
      getAssemblies(params, assemblyModel.getComplete, (error, assemblies) => {
        if (error) return done(error);
        done(null, assemblies, metadata);
      });
    },
    function (assemblies, metadata, done) {
      const subtypes = assemblyModel.groupAssembliesBySubtype(assemblies);
      async.parallel({
        subtrees: addPublicAssemblyCounts.bind(null, subtypes, collectionId),
        tree: getTree.bind(null, collectionId),
      }, (error, { tree, subtrees }) => {
        if (error) {
          done(error);
          return;
        }

        done(null, {
          collectionId,
          title: metadata.title,
          description: metadata.description,
          dateCreated: metadata.uploadEnded,
          assemblies,
          tree,
          subtrees,
        });
      });
    },
  ], (error, result) => {
    if (error) {
      LOGGER.error(error);
      callback(error);
      return;
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
  ], (error, result) => {
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
      const subtreeAssemblyIds = subtree.map(_ => _.uuid);
      const collectionAssemblyIds = new Set(collection.map(_ => _.uuid));
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
  ], (error, result) => {
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
  getMetadata(collectionId, (error, doc, cas) => {
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

exports.getAggregated = function (collectionId) {
  return new Promise((resolve, reject) => {
    getMetadata(collectionId, (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });
  }).then(metadata =>
    assemblyModel.getAssemblies(Object.keys(metadata.assemblyIdToNameMap)).
      then(assemblies => ({
        collectionId,
        assemblies,
        title: metadata.title,
        description: metadata.description,
        tree: metadata.tree,
        subtrees: metadata.subtrees,
      }))
    );
};

module.exports.getAssemblyIds = getAssemblyIds;
module.exports.getMetadata = getMetadata;
module.exports.get = get;
module.exports.getReference = getReference;
module.exports.getSubtree = getSubtree;
module.exports.getStatus = getStatus;
