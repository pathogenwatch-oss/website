const handle = require('./handler');

const messageQueueUtil = require('utils/messageQueueConnection');
const LOGGER = require('utils/logging').createLogger('runner');
const QUEUE_OPTIONS = { durable: true, autoDelete: false };

module.exports = function ({ mqConnection }) {
  const { NOTIFICATION, SERVICES } = messageQueueUtil.getExchanges();

  function onMessage(message, _, __, { queue }) {
    // messages from different sources can be different formats
    const { assemblyId = {} } = (message.data && Buffer.isBuffer(message.data))
      ? JSON.parse(message.data.toString())
      : message;
    const assemblyIdString = assemblyId.uuid || 'N/A';

    LOGGER.info(`Processing message:
Tasktype: ${message.taskType}
Action: ${message.action}
Status: ${message.taskStatus}
Assembly Id: ${assemblyIdString}
Collection: ${message.collectionId}`);

    handle(message).
      then(() => queue.shift()).
      catch(error => {
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
