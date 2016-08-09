const async = require('async');

const storageConnection = require('utils/storageConnection');
const messageQueueConnection = require('utils/messageQueueConnection');

const LOGGER = require('utils/logging').createLogger('microservice');

const serviceName = process.argv[2];

if (!serviceName) {
  LOGGER.error('Service name not provided.');
} else {
  async.parallel({
    storageConnection: storageConnection.connect,
    mqConnection: messageQueueConnection.connect,
  }, (error, connections) => {
    if (error) {
      LOGGER.error(error);
      return process.exit(1);
    }

    process.on('SIGTERM', () => {
      LOGGER.info('Received stop signal (SIGTERM), shutting down.');
      process.exit();
    });

    require(`./${serviceName}`)(connections);
  });
}
