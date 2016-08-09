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
      return LOGGER.error(error);
    }
    require(`./${serviceName}`)(connections);
  });
}
