var fs = require('fs');
var path = require('path');
var sanitize = require('sanitize-filename');

var messageQueueService = require('services/messageQueue');

var config = require('configuration.js');
var LOGGER = require('utils/logging').createLogger('File');

function getFile({ fileName }) {
  return fs.createReadStream(
    path.join(config.downloadFileLocation, sanitize(fileName))
  );
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

      if (message.taskStatus === 'FAILURE') {
        return callback(new Error('File generation failed'));
      }

      callback(null, message.fileNamesMap);
    });

    messageQueueService.getUploadExchange()
      .publish('file', request, { replyTo: queue.name });
  });
}

module.exports.getFile = getFile;
module.exports.requestDownload = requestDownload;
