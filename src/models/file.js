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


function getSpeciesFile(speciesId, fileName) {
  return fs.createReadStream(
    path.join(
      config.downloadFileLocation, sanitize(speciesId), sanitize(fileName)
    )
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

      if (message.taskStatus !== 'SUCCESS') {
        return callback(`${message.format} generation failed: ${message.taskStatus}`);
      }

      callback(null, message.fileNamesMap);
    });

    messageQueueService.getUploadExchange()
      .publish('file', request, { replyTo: queue.name });
  });
}

module.exports.getFile = getFile;
module.exports.getSpeciesFile = getSpeciesFile;
module.exports.requestDownload = requestDownload;
