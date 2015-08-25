var messageQueueService = require('services/messageQueue');

var LOGGER = require('utils/logging').createLogger('File');

function requestDownload(req, callback) {
  var assemblyIdToUserIdMap = req.body;
  var idType = req.params.idType;
  var requestedFormat = req.params.fileFormat;
  var request = {
    idType: idType,
    format: requestedFormat,
    idToUserNameMap: assemblyIdToUserIdMap
  };

  messageQueueService.newFileRequestQueue(function (queue){
    queue.subscribe(function (error,message) {
      if (error) {
        LOGGER.error(error);
        return callback(error,null);
      }
      LOGGER.info('Received response', message);
      queue.destroy();
      callback(null,request);
    });

    messageQueueService.getUploadExchange()
      .publish('file', request, {replyTo: queue.name});
  });
}

module.exports.requestDownload = requestDownload;