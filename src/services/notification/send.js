const notificationDispatcher = require('services/notificationDispatcher');

module.exports = ({ channel, topic, message }) =>
  notificationDispatcher.publishNotification(channel, topic, message);
