const messageQueueService = require('services/messageQueue');

const LOGGER = require('utils/logging').createLogger('File');

module.exports = function ({ request }) {
  return new Promise((resolve, reject) => {
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
    });
  });
};
