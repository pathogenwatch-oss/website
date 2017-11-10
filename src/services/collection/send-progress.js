const notificationDispatcher = require('services/notificationDispatcher');

const services = require('services');

module.exports = function ({ clientId }) {
  return services.request('collection', 'fetch-progress', { uuid: clientId })
    .then(collection => {
      if (collection.reference) return;
      const { status, progress } = collection.toObject();
      notificationDispatcher.publishNotification(
        clientId, 'progress', { status, progress }
      );
    });
};
