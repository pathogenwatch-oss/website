var LOGGER = require('utils/logging').createLogger('Storage');
var storageConnections = require('utils/storageConnection').getConnections();

function Storage(type) {
  this.connection = storageConnections[type];
}

function store(key, value, callback) {
  this.connection.upsert(key, value, function (error, result) {
    if (error) {
      LOGGER.error('✗ Failed to store "' + key + '": ' + error);
      return callback(error);
    }
    LOGGER.info('Successfully stored ' + key);
    callback(null, result.cas);
  });
}

function retrieve(key, callback) {
  this.connection.get(key, function (error, result) {
    if (error) {
      LOGGER.error('✗ Failed to retrieve "' + key + '": ' + error);
      return callback(error);
    }
    LOGGER.info('Successfully retrieved ' + key);
    callback(null, result.value, result.cas);
  });
}

function createMultiError(errorCount, documents) {
  documents.errorCount = errorCount;
  return documents;
}

function retrieveMany(keys, callback) {
  this.connection.getMulti(keys, function (errorCount, result) {
    if (errorCount) {
      LOGGER.error('✗ Failed to retrieve ' + errorCount + ' keys.');
      LOGGER.error(result);
      return callback(createMultiError(errorCount, result), null);
    }
    LOGGER.info('Successfully retrieved ' + keys);
    callback(null, Object.keys(result).reduce(function (memo, key) {
      memo[key] = result[key].value;
      return memo;
    }, {}));
  });
}

Storage.prototype.store = store;
Storage.prototype.retrieve = retrieve;
Storage.prototype.retrieveMany = retrieveMany;

var STORAGE_TYPES = {
  main: new Storage('main'),
  sequences: new Storage('sequences'),
  cache: new Storage('cache')
  // feedback: new Storage('feedback')
};

module.exports = function (type) {
  return STORAGE_TYPES[type];
};
