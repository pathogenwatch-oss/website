var mainStorage = require('services/storage')('main');

var logger = require('utils/logging').createLogger('Antibiotic model');

function getAll(callback) {
  logger.info('Getting list of all antibiotics');

  mainStorage.retrieve('ANTIMICROBIALS_ALL', function (error, result) {
    if (error) {
      return callback(error, result);
    }
    var antibiotics = result.antibiotics;
    logger.info('Got the list of all antibiotics');
    callback(null, antibiotics);
  });
}

module.exports.getAll = getAll;
