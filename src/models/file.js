var messageQueueService = require('services/messageQueue');
var fileStorage = require('services/storage')('cache');

var LOGGER = require('utils/logging').createLogger('File');

function getFile(fileName, callback) {
  fileStorage.retrieve(fileName, callback);
}

function requestDownload(request, callback) {
  messageQueueService.newFileRequestQueue(function (queue) {
    queue.subscribe(function (error, message) {
      if (error) {
        LOGGER.error(error);
        return callback(error, null);
      }
      LOGGER.info('Received response', message);
      queue.destroy();
      callback(null, message.fileNames);
    });

    messageQueueService.getUploadExchange()
      .publish('file', request, { replyTo: queue.name });
  });
}

module.exports.getFile = getFile;
module.exports.requestDownload = requestDownload;
