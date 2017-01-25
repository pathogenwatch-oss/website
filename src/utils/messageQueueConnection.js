var amqp = require('amqp');
var extend = require('extend');
var os = require('os');

var appConfig = require('configuration');

var LOGGER = require('utils/logging').createLogger('Message Queue');
var CONNECTION_OPTIONS = {
  host: appConfig.rabbit.ip,
  port: appConfig.rabbit.port,
  login: appConfig.rabbit.login,
  password: appConfig.rabbit.password,
  heartbeat: 60,
};
var EXCHANGE_CONFIG = {
  COLLECTION_ID: {
    name: 'grid-ex',
    type: 'direct',
  },
  NOTIFICATION: {
    name: 'notifications-ex',
    type: 'direct',
  },
  SERVICES: {
    name: 'me-services-ex',
    type: 'topic',
    options: {
      passive: false,
      confirm: true,
    },
  },
  TASK: {
    name: 'wgst-tasks-ex',
    type: 'topic',
  },
  UPLOAD: {
    name: 'wgst-ex',
    type: 'direct',
  },
};
var connection;
var exchanges = {};

function setDefaultPublishOptions(exchange) {
  var delegate = exchange.publish.bind(exchange);
  var DEFAULT_OPTIONS = {
    mandatory: true,
    contentType: 'application/json',
    deliveryMode: 1,
    correlationId: os.hostname(),
  };
  exchange.publish = function (topic, message, options) {
    delegate(topic, message, extend({}, DEFAULT_OPTIONS, options),
      function (error) {
        if (error) {
          return LOGGER.error('Error in trying to publish: ' + error);
        }
        LOGGER.info(`Message was published: ${topic}`, message);
      }
    );
  };
}

function createExchange(exchangeKey) {
  const config = EXCHANGE_CONFIG[exchangeKey];
  const options = Object.assign({
    type: config.type,
    passive: true,
    durable: false,
    confirm: false,
    autoDelete: false,
    noDeclare: false,
  }, config.options);

  return new Promise((resolve) => {
    connection.exchange(config.name, options, exchange => {
      setDefaultPublishOptions(exchange);
      exchanges[exchangeKey] = exchange;
      LOGGER.info(`✔ Exchange "${exchange.name}" is open`);
      resolve();
    });
  });
}

function connect() {
  connection =
    amqp.createConnection(CONNECTION_OPTIONS);

  return new Promise((resolve, reject) => {
    connection.on('error', error => {
      LOGGER.error(error);
      reject(error);
    });

    connection.on('ready', () => {
      LOGGER.info('✔ Connection is ready');

      Promise.all(Object.keys(EXCHANGE_CONFIG).map(createExchange)).
        then(() => resolve(connection)).
        catch(error => reject(error));
    });
  });
}

function getConnection() {
  return connection;
}

function getExchanges() {
  return exchanges;
}

module.exports.connect = connect;
module.exports.getConnection = getConnection;
module.exports.getExchanges = getExchanges;
