const mainStorage = require('services/storage')('main');

const LOGGER = require('utils/logging').createLogger('Antibiotic model');
const { ANTIMICROBIALS, AMLIST } = require('utils/documentKeys');

function formatForFrontend(master, species) {
  return species.antibiotics.reduce((memo, { antibioticKey }) => {
    const am = master.antimicrobials.find(_ => _.key === antibioticKey);
    if (!am) return memo;
    const { key, antimicrobialClass, fullName } = am;
    memo.push({ key, antimicrobialClass, fullName });
    return memo;
  }, []);
}

function get(speciesId, callback) {
  LOGGER.info(`Getting list of antibiotics for species: ${speciesId}`);
  const documentKeys = [ AMLIST, `${ANTIMICROBIALS}_${speciesId}` ];
  return mainStorage.retrieveMany(documentKeys, (errors, results) => {
    if (errors) return callback(errors);
    return callback(null, formatForFrontend(
      ...documentKeys.map(key => results[key])
    ));
  });
}

module.exports.get = get;
