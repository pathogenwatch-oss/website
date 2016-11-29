const analysisResults = require('models/analysisResults');

const messageQueueUtil = require('utils/messageQueueConnection');
const logging = require('utils/logging');

const LOGGER = logging.createLogger('upload progress');

const QUEUE_OPTIONS = { durable: true, autoDelete: false };

module.exports = function ({ mqConnection }) {
  const { NOTIFICATION, SERVICES } = messageQueueUtil.getExchanges();

  function onMessage(message, _, __, { queue }) {
    // messages from different sources can be different formats
    if (message.data && Buffer.isBuffer(message.data)) {
      message = JSON.parse(message.data.toString());
    }

    analysisResults.handleResult(message).
      catch(error => {
        LOGGER.error(error);
        SERVICES.publish('aggregator-error', { error, message });
      }).
      finally(() => queue.shift());
  }

  mqConnection.queue('aggregator-queue', QUEUE_OPTIONS, queue => {
    queue.bind(NOTIFICATION.name, '*');
    queue.subscribe({ ack: true }, onMessage);
    LOGGER.info(`${queue.name} is open.`);
  });

  mqConnection.queue('aggregator-errors-queue', QUEUE_OPTIONS, queue => {
    queue.bind(SERVICES.name, 'aggregator-error');
    LOGGER.info(`${queue.name} is open.`);
  });
};
