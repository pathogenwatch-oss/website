const mainStorage = require('services/storage')('main');

const LOGGER = require('utils/logging').createLogger('Antibiotic model');
const { ANTIMICROBIALS } = require('utils/documentKeys');

function flattenStructureForFrontend(doc) {
  return (
    Object.keys(doc).
      map(antibioticClassname => {
        const antibioticClass = doc[antibioticClassname];
        return (
          Object.keys(antibioticClass).
            map(antibioticKey => antibioticClass[antibioticKey].antibioticName)
        );
      }).
      reduce((flatArray, antibiotics) => flatArray.concat(antibiotics))
  );
}

function get(speciesId, callback) {
  LOGGER.info(`Getting list of antibiotics for species: ${speciesId}`);

  mainStorage.retrieve(`${ANTIMICROBIALS}_${speciesId}`, (error, result) => {
    if (error) {
      return callback(error, result);
    }

    LOGGER.info('Got the list of all antibiotics');
    return callback(null, flattenStructureForFrontend(result.antibiotics));
  });
}

module.exports.get = get;
