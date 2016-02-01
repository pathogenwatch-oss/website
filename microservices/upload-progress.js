const async = require('async');

const storageConnection = require('utils/storageConnection');
const messageQueueConnection = require('utils/messageQueueConnection');
const logging = require('utils/logging');

const LOGGER = logging.createLogger('upload progress');

async.parallel({
  storage: storageConnection.connect,
  mqConnection: messageQueueConnection.connect
}, function (error, { mqConnection }) {
  if (error) {
    return LOGGER.error(error);
  }

  const { NOTIFICATION } = messageQueueConnection.getExchanges();
  // const mainStorage = require('services/storage')('main');

  mqConnection.queue(`upload-progress-queue`, {}, function (queue) {
    LOGGER.info(`${queue.name} is open.`);
    queue.bind(NOTIFICATION.name, '*');

    queue.subscribe({ ack: true }, function (message) {
      LOGGER.debug(message.data);
      queue.shift();
    });
  });
});
