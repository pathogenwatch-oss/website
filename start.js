const LOGGER = require('utils/logging').getBaseLogger();

require('./server')().
  then(() => LOGGER.info('*** Application started ***')).
  catch(error => {
    LOGGER.error(error);
    LOGGER.error('*** Application not started ***');
    return process.exit(1);
  });
