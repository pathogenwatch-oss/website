const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const mongoConfig = require('configuration').mongodb || {};
const LOGGER = require('utils/logging').createLogger('Mongo');

const DEFAULT_HOSTNAME = '127.0.0.1';
const DEFAULT_PORT = '27017';
const DEFAULT_DATABASE = 'pw';
const hostname = mongoConfig.host || DEFAULT_HOSTNAME;
const port = mongoConfig.port || DEFAULT_PORT;
const database = mongoConfig.database || DEFAULT_DATABASE;
const replicaset = mongoConfig.replicaset;

const dbUrl = `mongodb://${hostname}:${port}/${database}${replicaset ? `?replicaSet=${replicaset}` : ''}`;

const handleError = error => {
  LOGGER.error(error);
  process.exit(1);
};

let disconnectExpected = false;

function connect(callback) {
  mongoose.connection.on('error', handleError);
  mongoose.connection.on('disconnected', () => {
    if (disconnectExpected) return
    handleError('disconnected event')
  });
  if (callback) {
    mongoose.connection.once('open', callback);
  }

  LOGGER.info(`Connecting to mongodb: ${dbUrl}`);
  return mongoose.connect(dbUrl);
}

mongoose.set('debug', (collection, ...args) => {
  if (collection === 'clustering' && args[0] === 'update') {
    LOGGER.debug([ collection, ...args.slice(0, 2), 'TOO_LONG', ...args.slice(3) ]);
  } else LOGGER.debug([ collection, ...args ]);
});

module.exports.connect = connect;
module.exports.dbUrl = dbUrl;
module.exports.close = () => {
  disconnectExpected = true;
  mongoose.connection.close()
};
