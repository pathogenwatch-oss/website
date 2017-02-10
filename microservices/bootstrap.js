const storage = require('utils/storageConnection');
const messageQueue = require('utils/messageQueueConnection');
const mongo = require('utils/mongoConnection');

const LOGGER = require('utils/logging').createLogger('microservice');

const serviceName = process.argv[2];

const formatConnections =
  ([ storageConnection, mqConnection, mongoConnection ]) => ({
    storageConnection, mqConnection, mongoConnection,
  });

if (!serviceName) {
  LOGGER.error('Service name not provided.');
} else {
  Promise.all([
    storage.connect(),
    messageQueue.connect(),
    mongo.connect(),
  ]).
  then(connections => {
    process.on('SIGTERM', () => {
      LOGGER.info('Received stop signal (SIGTERM), shutting down.');
      process.exit();
    });

    require(`./${serviceName}`)(formatConnections(connections));
  }).
  catch(error => {
    LOGGER.error(error);
    return process.exit(1);
  });
}
