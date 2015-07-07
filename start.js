var LOGGER = require('utils/logging').getBaseLogger();

require('./server')(function (error) {
  if (error) {
    return LOGGER.error('*** Application not started ***');
  }
  LOGGER.info('*** Application started ***');
});
