var mainStorage = require('services/storage')('main');

const LOGGER = require('utils/logging').createLogger('Antibiotic model');
const { ANTIMICROBIALS } = require('utils/documentKeys');

function formatLongName(longName) {
  return longName ?
    longName.
      split(' ').
      map(word => `${word[0].toUpperCase()}${word.slice(1)}`).
      join(' ') :
    null;
}

function formatForFrontend(doc) {
  return (
    Object.keys(doc).
      map(antibioticClassname => {
        const antibioticClass = doc[antibioticClassname];
        return (
          Object.keys(antibioticClass).
            map(antibioticKey => ({
              name: antibioticClass[antibioticKey].antibioticName,
              longName: formatLongName(antibioticClass[antibioticKey].altName),
            }))
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
    return callback(null, formatForFrontend(result.antibiotics));
  });
}

module.exports.get = get;
