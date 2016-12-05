const LOGGER = require('utils/logging').createLogger('Storage');
const storageConnections = require('utils/storageConnection').getConnections();

function Storage(type) {
  this.connection = storageConnections[type];
}

function store(key, value, callback) {
  return new Promise((resolve, reject) =>
    this.connection.upsert(key, value, (error, result) => {
      if (error) {
        LOGGER.error(`✗ Failed to store "${key}": ${error}`);
        return reject(error);
      }
      LOGGER.info(`Successfully stored ${key}`);
      return resolve(result.cas);
    })
  ).
  then(cas => (callback ? callback(null, cas) : cas)).
  catch(error => (callback ? callback(error) : error));
}

function retrieve(key, callback) {
  return new Promise((resolve, reject) =>
    this.connection.get(key, (error, result) => {
      if (error) {
        LOGGER.error(`✗ Failed to retrieve "${key}": ${error}`);
        return reject(error);
      }
      LOGGER.info(`Successfully retrieved ${key}`);
      return resolve(result.value);
    })
  ).
  then(value => (callback ? callback(null, value) : value)).
  catch(error => (callback ? callback(error) : error));
}

function retrieveMany(keys, callback) {
  return new Promise((resolve) =>
    this.connection.getMulti(keys, (errorCount, result) => {
      const { erroredKeys, results } =
        Object.keys(result).reduce((memo, key) => {
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
        // resolve to allow partial errors to continue
        return resolve({ erroredKeys, results });
      }
      LOGGER.info(`Successfully retrieved ${keys}`);
      return resolve({ results });
    })).
    then(value =>
      (callback ? callback(value.erroredKeys, value.results) : value)
    ).
    catch(error => (callback ? callback(error) : error));
}

Storage.prototype.store = store;
Storage.prototype.retrieve = retrieve;
Storage.prototype.retrieveMany = retrieveMany;

const STORAGE_TYPES = {
  main: new Storage('main'),
  sequences: new Storage('sequences'),
};

module.exports = function (type) {
  return STORAGE_TYPES[type];
};
