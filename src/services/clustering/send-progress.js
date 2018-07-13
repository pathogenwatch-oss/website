const notificationDispatcher = require('services/notificationDispatcher');

module.exports = function ({ taskId, payload }) {
  notificationDispatcher.publishNotification(
    taskId, 'clustering', Object.assign({ timestamp: Date.now() }, payload)
  );
};
