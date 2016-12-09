const handle = require('./handler');

const messageQueueUtil = require('utils/messageQueueConnection');
const LOGGER = require('utils/logging').createLogger('aggregator');
const QUEUE_OPTIONS = { durable: true, autoDelete: false };

module.exports = function ({ mqConnection }) {
  const { NOTIFICATION, SERVICES } = messageQueueUtil.getExchanges();

  function onMessage(message, _, __, { queue }) {
    // messages from different sources can be different formats
    if (message.data && Buffer.isBuffer(message.data)) {
      message = JSON.parse(message.data.toString());
    }

    const { taskType, taskStatus, assemblyId = {}, collectionId } = message;
    const assemblyIdString = assemblyId.uuid || 'N/A';

    LOGGER.info(`Processing message:
Tasktype: ${taskType}
Status: ${taskStatus}
Assembly Id: ${assemblyIdString}
Collection: ${collectionId}`);

    handle(message).
      then(() => queue.shift()).
      catch(error => {
        LOGGER.error(error);
        SERVICES.publish('aggregator-error', { error, message });
        queue.shift();
      });
  }

  mqConnection.queue('aggregator-queue', QUEUE_OPTIONS, queue => {
    queue.bind(NOTIFICATION.name, '*.*.ASSEMBLY.*');
    queue.bind(NOTIFICATION.name, '*.*.COLLECTION.*');
    queue.subscribe({ ack: true }, onMessage);
    LOGGER.info(`${queue.name} is open.`);
  });

  mqConnection.queue('aggregator-errors-queue', QUEUE_OPTIONS, queue => {
    queue.bind(SERVICES.name, 'aggregator-error');
    LOGGER.info(`${queue.name} is open.`);
  });
};
