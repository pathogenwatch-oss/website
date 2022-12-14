const mongo = require('utils/mongoConnection');

const LOGGER = require('utils/logging').createLogger('microservice');

const serviceName = process.argv[2];

function getConnections() {
  return Promise.resolve({ mongoConnection: mongo.connect() });
}

if (!serviceName) {
  LOGGER.error('Service name not provided.');
} else {
  getConnections(serviceName)
    .then(connections => {
      process.on('SIGTERM', () =>
        mongo.close().then(() => {
          LOGGER.info('Received stop signal (SIGTERM), shutting down.');
          process.exit();
        })
      );
      require(`./${serviceName}`)(connections);
    })
    .catch(error => {
      LOGGER.error(error);
      return process.exit(1);
    });
}
