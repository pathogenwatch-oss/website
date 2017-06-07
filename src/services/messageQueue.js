var uuid = require('uuid/v4');

var messageQueueConnection = require('utils/messageQueueConnection');

var connection = messageQueueConnection.getConnection();
var exchanges = messageQueueConnection.getExchanges();
var LOGGER = require('utils/logging').createLogger('Message Queue');

/**
 * "Nodefying" Decorator Function
 *
 * The decorated method will expect a `function (err, message) {...}` callback,
 * this allows for more "Node-style" error handling.
 */
function parseMessagesAsJson(queue) {
  if (!queue.subscribe) {
    return;
  }
  const delegate = queue.subscribe.bind(queue);

  queue.subscribe = function (callback) {
    delegate(function (message) {
      var buffer = new Buffer(message.data);
      var bufferJSON = buffer.toString();
      try {
        LOGGER.debug('Parsing message ' + bufferJSON);
        const parsedMessage = JSON.parse(bufferJSON);
        callback(null, parsedMessage);
      } catch (error) {
        callback(error, null);
      }
    });
  };
}

function generateQueueId(prefix) {
  return (prefix + uuid());
}

function newCollectionAddQueue(callback) {
  var queueId = generateQueueId('create-collection-queue-');
  return connection.queue(queueId, {
    passive: false,
    durable: false,
    autoDelete: true,
    noDeclare: false,
    closeChannelOnUnsubscribe: false,
  }, function (queue) {
    LOGGER.info(`Queue "${queue.name}" is open`);
    parseMessagesAsJson(queue);
    callback(queue);
  });
}

function newFileRequestQueue(callback) {
  var queueId = generateQueueId('file-request-queue-');
  return connection.queue(queueId, {
    passive: false,
    durable: false,
    autoDelete: true,
    noDeclare: false,
    closeChannelOnUnsubscribe: false,
  }, function (queue) {
    LOGGER.info(`Queue "${queue.name}" is open`);
    parseMessagesAsJson(queue);
    callback(queue);
  });
}

function newUploadProgressRequestQueue(collectionId, callback) {
  return connection.queue(`upload-progress-request-${collectionId}`, {
    passive: false,
    durable: false,
    autoDelete: true,
    noDeclare: false,
    closeChannelOnUnsubscribe: false,
  }, function (queue) {
    LOGGER.info(`Queue "${queue.name}" is open`);

    const delegate = queue.subscribe.bind(queue);
    queue.subscribe = handler => {
      delegate(message => {
        const { error } = message;
        handler(error);
      });
    };
    callback(queue);
  });
}

function newPublishRequestQueue(callback) {
  var queueId = generateQueueId('publish-request-queue-');
  return connection.queue(queueId, {
    passive: false,
    durable: false,
    autoDelete: true,
    noDeclare: false,
    closeChannelOnUnsubscribe: false,
  }, function (queue) {
    LOGGER.info(`Queue "${queue.name}" is open`);
    parseMessagesAsJson(queue);
    callback(queue);
  });
}

function getUploadExchange() {
  return exchanges.UPLOAD;
}

function getTaskExchange() {
  return exchanges.TASK;
}

function getCollectionIdExchange() {
  return exchanges.COLLECTION_ID;
}

function getServicesExchange() {
  return exchanges.SERVICES;
}

function getNotificationExchange() {
  return exchanges.NOTIFICATION;
}

module.exports.newCollectionAddQueue = newCollectionAddQueue;
module.exports.newFileRequestQueue = newFileRequestQueue;
module.exports.newUploadProgressRequestQueue = newUploadProgressRequestQueue;
module.exports.newPublishRequestQueue = newPublishRequestQueue;
module.exports.getUploadExchange = getUploadExchange;
module.exports.getTaskExchange = getTaskExchange;
module.exports.getCollectionIdExchange = getCollectionIdExchange;
module.exports.getServicesExchange = getServicesExchange;
module.exports.getNotificationExchange = getNotificationExchange;
