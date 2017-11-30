const notificationDispatcher = require('services/notificationDispatcher');

module.exports = function ({ clientId, task, result, progress }) {
  notificationDispatcher.publishNotification(clientId, 'progress', { task, result, progress });
};
