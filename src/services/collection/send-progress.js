const notificationDispatcher = require('services/notificationDispatcher');

module.exports = function ({ clientId, payload }) {
  notificationDispatcher.publishNotification(
    clientId, 'progress', { timestamp: Date.now(), ...payload }
  );
};
