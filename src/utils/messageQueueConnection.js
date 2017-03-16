const amqp = require('amqp');
const os = require('os');

const appConfig = require('configuration');

const LOGGER = require('utils/logging').createLogger('Message Queue');

const {
  host = 'localhost',
  port = '5672',
  login, password,
  vhost = '/',
  heartbeat = 60,
} = appConfig.rabbit;

const CONNECTION_OPTIONS = { host, port, login, password, vhost, heartbeat };
const EXCHANGE_CONFIG = {
  COLLECTION_ID: {
    name: 'grid-ex',
    type: 'direct',
    options: {
      passive: false,
      confirm: true,
      durable: true,
    },
  },
  NOTIFICATION: {
    name: 'notifications-ex',
    type: 'topic',
    options: {
      passive: false,
      confirm: true,
      durable: true,
    },
  },
  SERVICES: {
    name: 'me-services-ex',
    type: 'topic',
    options: {
      passive: false,
      confirm: true,
      durable: true,
    },
  },
  TASK: {
    name: 'wgst-tasks-ex',
    type: 'topic',
    options: {
      passive: false,
      confirm: true,
      durable: true,
    },
  },
  UPLOAD: {
    name: 'wgst-ex',
    type: 'direct',
    options: {
      passive: false,
      confirm: true,
      durable: true,
    },
  },
};
const exchanges = {};
let connection;

function setDefaultPublishOptions(exchange) {
  const delegate = exchange.publish.bind(exchange);
  const DEFAULT_OPTIONS = {
    mandatory: true,
    contentType: 'application/json',
    deliveryMode: 1,
    correlationId: os.hostname(),
  };
  exchange.publish = function (topic, message, options) {
    delegate(topic, message, Object.assign({}, DEFAULT_OPTIONS, options),
      error => {
        if (error) {
          return LOGGER.error(`Error in trying to publish: ${error}`);
        }
        return LOGGER.info(`Message was published: ${topic}`, message);
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
