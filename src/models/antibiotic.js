var mainStorage = require('services/storage')('main');

var LOGGER = require('utils/logging').createLogger('Antibiotic model');
var { ANTIMICROBIALS } = require('utils/documentKeys');

function flattenStructureForFrontend(document) {
  return (
    Object.keys(document).
      map(function (antibioticClassname) {
        var antibioticClass = document[antibioticClassname];
        return (
          Object.keys(antibioticClass).map(function (antibioticKey) {
            return antibioticClass[antibioticKey].antibioticName;
          })
        );
      }).
      reduce((flatArray, antibiotics) => flatArray.concat(antibiotics))
      .sort()
  );
}

function get(speciesId, callback) {
  LOGGER.info(`Getting list of antibiotics for species: ${speciesId}`);

  mainStorage.retrieve(`${ANTIMICROBIALS}_${speciesId}`, function (error, result) {
    if (error) {
      return callback(error, result);
    }

    LOGGER.info('Got the list of all antibiotics');
    callback(null, flattenStructureForFrontend(result.antibiotics));
  });
}

module.exports.get = get;
