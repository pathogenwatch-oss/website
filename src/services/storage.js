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

function retrieveMany(keys, callback) {
  this.connection.getMulti(keys, (errorCount, result) => {
    const { erroredKeys, results } = Object.keys(result).reduce((memo, key) => {
      const { error, value } = result[key];
      if (error) {
        memo.erroredKeys.push(key);
      }

      if (value) {
        memo.results[key] = value;
      }
      return memo;
    }, { erroredKeys: [], results: {} });

    if (errorCount) {
      LOGGER.error(`✗ Failed to retrieve ${errorCount} keys: ${erroredKeys}`);
      return callback(erroredKeys, results);
    }
    LOGGER.info('Successfully retrieved ' + keys);
    callback(null, results);
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
