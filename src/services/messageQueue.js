var uuid = require('node-uuid');

var notificationService = require('services/notification');
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
  var delegate = queue.subscribe.bind(queue);

  queue.subscribe = function (callback) {
    delegate(function (message) {
      var buffer = new Buffer(message.data);
      var bufferJSON = buffer.toString();
      try {
        LOGGER.debug('Parsing message ' + bufferJSON);
        var parsedMessage = JSON.parse(bufferJSON);
        callback(null, parsedMessage);
      } catch (error) {
        callback(error, null);
      }
    });
  };
}

// bind this function to a queue to give access to "name"
function logMessages(message) {
  LOGGER.info('Received message from ' + this.name + ':');
  LOGGER.info(message);
}

function generateQueueId(prefix) {
  return (prefix + uuid.v4());
}

function newCollectionNotificationQueue(ids, notifyOptions, callback) {
  connection.queue(
    'NOTIFICATION_' + ids.collectionId,
    { exclusive: true },
    function (queue) {
      LOGGER.info('Notification queue "' + queue.name + '" is open');

      queue.bind(
        exchanges.NOTIFICATION.name,
        ids.speciesId + '.*.COLLECTION.' + ids.collectionId
      );

      parseMessagesAsJson(queue);
      notificationService.notifyResults(queue, notifyOptions);
      callback(queue);
    }
  );
}

function newAssemblyNotificationQueue(ids, notifyOptions, callback) {
  connection.queue(
    'NOTIFICATION_' + ids.assemblyId,
    { exclusive: true },
    function (queue) {
      LOGGER.info('Notification queue "' + queue.name + '" is open');

      queue.bind(
        exchanges.NOTIFICATION.name,
        ids.speciesId + '.*.ASSEMBLY.' + ids.assemblyId
      );

      parseMessagesAsJson(queue);
      notificationService.notifyResults(queue, notifyOptions);
      callback(queue);
    }
  );
}

function newAssemblyUploadQueue(assemblyId, callback) {
  connection.queue(
    'ASSEMBLY_UPLOAD_' + assemblyId, {
      passive: false,
      durable: false,
      exclusive: true,
      autoDelete: true,
      noDeclare: false,
      closeChannelOnUnsubscribe: false
    },
    function (queue) {
      LOGGER.info('Upload queue "' + queue.name + '" is open');
      parseMessagesAsJson(queue);
      queue.subscribe(logMessages.bind(queue));
      callback(queue);
    }
  );
}

function newCollectionAddQueue(callback) {
  var queueId = generateQueueId('CREATE_COLLECTION_');
  return connection.queue(queueId, {
    passive: false,
    durable: false,
    exclusive: true,
    autoDelete: true,
    noDeclare: false,
    closeChannelOnUnsubscribe: false
  }, function (queue) {
    LOGGER.info('Queue "' + queue.name + '" is open');
    parseMessagesAsJson(queue);
    callback(queue);
  });
}

function getUploadExchange() {
  return exchanges.UPLOAD;
}

function getCollectionIdExchange() {
  return exchanges.COLLECTION_ID;
}

function getTasksExchange() {
  return exchanges.TASKS;
}

module.exports.newCollectionNotificationQueue = newCollectionNotificationQueue;
module.exports.newAssemblyNotificationQueue = newAssemblyNotificationQueue;
module.exports.newAssemblyUploadQueue = newAssemblyUploadQueue;
module.exports.newCollectionAddQueue = newCollectionAddQueue;
module.exports.getUploadExchange = getUploadExchange;
module.exports.getCollectionIdExchange = getCollectionIdExchange;
module.exports.getTasksExchange = getTasksExchange;
