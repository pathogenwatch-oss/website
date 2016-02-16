var fs = require('fs');
var path = require('path');

var messageQueueService = require('services/messageQueue');

var config = require('configuration.js');
var LOGGER = require('utils/logging').createLogger('File');

function getFile({ fileName, speciesId }) {
  return fs.createReadStream(
    path.join(config.downloadFileLocation, fileName)
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
