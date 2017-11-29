const notificationDispatcher = require('services/notificationDispatcher');

module.exports = function ({ clientId, task }) {
  notificationDispatcher.publishNotification(clientId, 'progress', { task });
};
