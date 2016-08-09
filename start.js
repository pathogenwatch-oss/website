var LOGGER = require('utils/logging').getBaseLogger();

require('./server')(function (error) {
  if (error) {
    LOGGER.error('*** Application not started ***');
    return process.exit(1);
  }
  LOGGER.info('*** Application started ***');
});
