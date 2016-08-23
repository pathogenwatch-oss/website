var amqp = require('amqp');
var extend = require('extend');
var async = require('async');
var os = require('os');

var appConfig = require('configuration');

var LOGGER = require('utils/logging').createLogger('Message Queue');
var CONNECTION_OPTIONS = {
  host: appConfig.rabbit.ip,
  port: appConfig.rabbit.port,
  login: appConfig.rabbit.login,
  password: appConfig.rabbit.password
};
var IMPLEMENTATION_OPTIONS = {
  reconnect: false,
  autoDelete: true
};
var EXCHANGE_CONFIG = {
  NOTIFICATION: {
    name: 'notifications-ex',
    type: 'direct',
    options: {
      // passive: false,
    },
  },
  UPLOAD: {
    name: 'wgst-ex',
    type: 'direct',
    options: {
      // passive: false,
    },
  },
  COLLECTION_ID: {
    name: 'grid-ex',
    type: 'direct',
    options: {
      // passive: false,
    },
  },
  SERVICES: {
    name: 'me-services-ex',
    type: 'topic',
    options: {
      passive: false,
      confirm: true
    }
  }
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

function createExchange(exchangeKey, callback) {
  const config = EXCHANGE_CONFIG[exchangeKey];
  const options = Object.assign({
    type: config.type,
    passive: true,
    durable: false,
    confirm: false,
    autoDelete: false,
    noDeclare: false
  }, config.options);
  connection.exchange(config.name, options, exchange => {
    setDefaultPublishOptions(exchange);
    exchanges[exchangeKey] = exchange;
    LOGGER.info('✔ Exchange "' + exchange.name + '" is open');
    callback();
  });
}

function connect(callback) {
  connection =
    amqp.createConnection(CONNECTION_OPTIONS, IMPLEMENTATION_OPTIONS);

  connection.on('error', function (error) {
    LOGGER.error(error);
    callback(error);
  });

  connection.on('ready', function () {
    LOGGER.info('✔ Connection is ready');

    async.each(
      Object.keys(EXCHANGE_CONFIG),
      function (exchangeKey, finishIteration) {
        createExchange(exchangeKey, finishIteration);
      },
      function (error) {
        if (error) {
          callback(error);
        }

        callback(null, connection);
      }
    );
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
