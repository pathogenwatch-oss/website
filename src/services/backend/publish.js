const messageQueueService = require('services/messageQueue');

module.exports = function ({ organismId, collectionId }) {
  return new Promise((resolve, reject) =>
    messageQueueService.newPublishRequestQueue(queue => {
      queue.subscribe((error, response) => {
        if (error) {
          reject(error);
          return;
        }
        queue.destroy();

        const { status } = response;
        if (status !== 'SUCCESS') {
          reject();
          return;
        }

        resolve();
      });

      messageQueueService.getCollectionIdExchange().publish('publish', {
        identifierType: 'Collection',
        identifiers: [ collectionId ],
        speciesId: organismId,
      }, { replyTo: queue.name });
    })
  );
};
