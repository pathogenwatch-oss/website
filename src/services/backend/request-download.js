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

function mapIdList(uuids, idType) {
  if (idType === 'collection') {
    return Promise.resolve(uuids.map(uuid => ({ key: uuid })));
  }

  return (
    CollectionGenome.find({ uuid: { $in: uuids } }, { name: 1, fileId: 1 })
      .lean()
      .then(results =>
        results.map(({ name, fileId }) => ({ name, key: fileId }))
      )
  );
}

module.exports = function ({ format, organismId, uuids, idType }) {
  return mapIdList(uuids, idType)
    .then(idList => ({
      format,
      idList,
      idType: idType === 'genome' ? 'assembly' : 'collection',
      speciesId: organismId,
    }))
    .then(sendToBackend);
};
