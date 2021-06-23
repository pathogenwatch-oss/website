const notificationDispatcher = require('services/notificationDispatcher');

module.exports = function ({ taskId, payload }) {
  notificationDispatcher.publishNotification(
    taskId, 'clustering', { timestamp: Date.now(), ...payload }
  );
};
