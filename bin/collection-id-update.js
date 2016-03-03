var fs = require('fs');
var async = require('async');

var storageConnection = require('utils/storageConnection');
var { ASSEMBLY_METADATA } = require('utils/documentKeys');
var LOGGER = require('utils/logging').getBaseLogger();

var FILE_PATH = process.argv[2];

async.waterfall([
  function (next) {
    storageConnection.connect(next);
  },
  function (next) {
    const file = fs.readFileSync(FILE_PATH, 'utf8');
    LOGGER.debug(file, FILE_PATH);
    return next(null, file.split('\n').filter(_ => _.length));
  },
  function (collectionIds, next) {
    const model = require('models/collection');
    const storage = require('services/storage')('main');

    function addCollectionId(collectionId, assemblyId, done) {
      const key = `${ASSEMBLY_METADATA}_${assemblyId}`;
      LOGGER.debug(key);
      storage.retrieve(key, function (error, metadata) {
        if (error) {
          return done(error);
        }
        metadata.collectionId = collectionId;

        storage.store(key, metadata, done);
      });
    }

    function updateMetadata(id, done) {
      model.getAssemblyIds(id, (error, ids) => {
        if (error) {
          return done(error);
        }
        LOGGER.debug(ids);
        async.each(
          ids.map(_ => _.assemblyId), addCollectionId.bind(null, id), done
        );

      });
    }

    async.each(collectionIds, updateMetadata, next);
  }
], function (error) {
  if (error) {
    console.error(error);
    return process.exit(1);
  }
  process.exit(0);
});
