var mainStorage = require('services/storage')('main');

var LOGGER = require('utils/logging').createLogger('Antibiotic model');

function flattenStructureForFrontend(document) {
  return (
    Object.keys(document).
      map(function (antibioticClassname) {
        var antibioticClass = document[antibioticClassname];
        return (
          Object.keys(antibioticClass).map(function (antibioticKey) {
            return antibioticClass[antibioticKey];
          })
        );
      }).
      reduce(function (flattenedObject, antibiotics) {
        antibiotics.forEach(function (antibiotic) {
          flattenedObject[antibiotic.antibioticName] = antibiotic.antibioticClass;
        });
        return flattenedObject;
      }, {})
  );
}

function get(speciesId, callback) {
  LOGGER.info('Getting list of antibiotics for species: ' + speciesId);

  mainStorage.retrieve('ANTIBIOTICS_LIST_' + speciesId, function (error, result) {
    if (error) {
      return callback(error, result);
    }

    LOGGER.info('Got the list of all antibiotics');
    callback(null, flattenStructureForFrontend(result.antibiotics));
  });
}

module.exports.get = get;
