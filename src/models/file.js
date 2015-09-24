var messageQueueService = require('services/messageQueue');
var fileStorage = require('services/storage')('cache');

var LOGGER = require('utils/logging').createLogger('File');

function constructFileFromParts(keys, parts) {
  return keys.reduce(function (file, partKey) {
    var step = file + parts[partKey];
    LOGGER.info('File Length: ' + step.length);
    return step;
  }, '');
}

function getFile(fileName, callback) {
  fileStorage.retrieve(fileName, function (error, partKeys) {
    if (error) return callback(error);
    LOGGER.info(partKeys);
    fileStorage.retrieveMany(partKeys, function (error, parts) {
      if (error) return callback(error);
      callback(null, constructFileFromParts(partKeys, parts));
    });
  });
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

      if (message.status === 'FAILURE') {
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
