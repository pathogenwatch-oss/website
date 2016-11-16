const mainStorage = require('services/storage')('main');

const LOGGER = require('utils/logging').createLogger('PAARSNP model');
const { PAARSNP_LIBRARY } = require('utils/documentKeys');

function formatForFrontend({ paarLibrary, snpLibrary }) {
  return {
    paar: paarLibrary.resistanceGenes.map(_ => _.familyName),
    snp:
      Object.keys(snpLibrary.sequences).
        reduce((memo, sequenceId) => memo.concat(
          snpLibrary.sequences[sequenceId].resistanceMutations.map(_ => _.name)
        ), []),
  };
}

function get(speciesId, callback) {
  LOGGER.info(`Getting PAARSNP library for species: ${speciesId}`);

  mainStorage.retrieve(`${PAARSNP_LIBRARY}_${speciesId}`, (error, result) => {
    if (error) {
      return callback(error, result);
    }

    LOGGER.info('Got the PAARSNP library');
    return callback(null, formatForFrontend(result));
  });
}

module.exports.get = get;
