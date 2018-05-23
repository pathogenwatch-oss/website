const notificationDispatcher = require('services/notificationDispatcher');

module.exports = function ({ clientId, payload }) {
  notificationDispatcher.publishNotification(
    clientId, 'clustering', Object.assign({ timestamp: Date.now() }, payload)
  );
};
