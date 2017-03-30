const messageQueueUtil = require('utils/messageQueueConnection');
const LOGGER = require('utils/logging').createLogger('watcher');
const QUEUE_OPTIONS = { durable: true, autoDelete: false };

const handleMessage = require('./messageHandler');

module.exports = function ({ mqConnection }) {
  const { NOTIFICATION, SERVICES } = messageQueueUtil.getExchanges();

  function onMessage(message, _, __, { queue }) {
    // messages from different sources can be different formats
    const { fileId, task, version } = (message.data && Buffer.isBuffer(message.data))
      ? JSON.parse(message.data.toString())
      : message;

    LOGGER.info(`Processing message: ${fileId} ${task} ${version}`);

    handleMessage(fileId, task, version)
      .then(() => queue.shift())
      .catch(error => {
        LOGGER.error(error);
        SERVICES.publish('watcher-error', { error, message });
        queue.shift();
      });
  }

  mqConnection.queue('watcher-queue', QUEUE_OPTIONS, queue => {
    queue.bind(NOTIFICATION.name, '*.*.ASSEMBLY.*');
    queue.bind(NOTIFICATION.name, '*.*.COLLECTION.*');
    queue.bind(NOTIFICATION.name, '*.matrix'); // for reference core results
    queue.subscribe({ ack: true }, onMessage);
    LOGGER.info(`${queue.name} is open.`);
  });

  mqConnection.queue('watcher-errors-queue', QUEUE_OPTIONS, queue => {
    queue.bind(SERVICES.name, 'watcher-error');
    LOGGER.info(`${queue.name} is open.`);
  });
};
