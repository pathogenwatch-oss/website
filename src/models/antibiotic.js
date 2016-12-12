const mainStorage = require('services/storage')('main');

const LOGGER = require('utils/logging').createLogger('Antibiotic model');
const { ANTIMICROBIALS, AMLIST } = require('utils/documentKeys');

function formatForFrontend(master, species) {
  return master.reduce((memo, { key, antimicrobialClass, fullName }) => {
    const ab = species.find(_ => _.antibioticKey === key);
    if (!ab) return memo;
    memo.push({ key, antimicrobialClass, fullName });
    return memo;
  }, []);
}

function get(speciesId, callback) {
  LOGGER.info(`Getting list of antibiotics for species: ${speciesId}`);
  const documentKeys = [ AMLIST, `${ANTIMICROBIALS}_${speciesId}` ];
  return mainStorage.retrieveMany(documentKeys, (errors, results) => {
    if (errors) return callback(errors);
    return callback(null, formatForFrontend(...results));
  });
}

module.exports.get = get;
