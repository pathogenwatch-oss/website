const messageQueueService = require('services/messageQueue');

const CollectionGenome = require('models/collectionGenome');

const LOGGER = require('utils/logging').createLogger('File');

function sendToBackend(request) {
  return new Promise((resolve, reject) =>
    messageQueueService.newFileRequestQueue(queue => {
      queue.subscribe((error, message) => {
        if (error) {
          LOGGER.error(error);
          return reject(error);
        }
        LOGGER.info('Received response', message);
        queue.destroy();

        if (message.taskStatus !== 'SUCCESS') {
          return reject(new Error(`${message.format} generation failed: ${message.taskStatus}`));
        }

        resolve(message.fileNamesMap);
      });

      messageQueueService.getUploadExchange()
        .publish('file', request, { replyTo: queue.name });
    })
  );
}

module.exports = function ({ format, organismId, idList }) {
  return CollectionGenome.find({ uuid: { $in: idList } }, { name: 1, fileId: 1 })
    .lean()
    .then(results => ({
      format,
      idList: results.map(({ name, fileId }) => ({ name, checksum: fileId })),
      idType: 'assembly',
      speciesId: organismId,
    }))
    .then(sendToBackend);
};
