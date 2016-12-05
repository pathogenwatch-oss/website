const mongoose = require('mongoose');

const appConfig = require('configuration');
const LOGGER = require('utils/logging').createLogger('Mongo');

const DEFAULT_HOSTNAME = '127.0.0.1';
const DEFAULT_PORT = '27017';
const DEFAULT_COLLECTION = 'Wgsa';
const hostname = appConfig.mongodb.hostname || DEFAULT_HOSTNAME;
const port = appConfig.mongodb.port || DEFAULT_PORT;
const collection = appConfig.mongodb.collection || DEFAULT_COLLECTION;

const dbUrl = `mongodb://${hostname}:${port}/${collection}`;

function connect(callback) {
  mongoose.connection.on('error', (error) => LOGGER.error(error));
  mongoose.connection.once('open', callback);

  LOGGER.info(`Connecting to mongodb: ${dbUrl}`);
  mongoose.connect(dbUrl);
}

module.exports.connect = connect;
module.exports.dbUrl = dbUrl;
