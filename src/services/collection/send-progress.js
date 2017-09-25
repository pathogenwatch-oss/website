const notificationDispatcher = require('services/notificationDispatcher');

const services = require('services');

module.exports = function ({ collectionId }) {
  return services.request('collection', 'fetch-progress', { uuid: collectionId })
    .then(collection => {
      if (collection.reference) return;

      const { status, progress } = collection.toObject();
      notificationDispatcher.publishNotification(
        collectionId, 'progress', { status, progress }
      );
    });
};
