const Pusher = require('pusher');

const pusherConfig = require('configuration').pusher;
const LOGGER = require('utils/logging').createLogger('Pusher');

const pusher = new Pusher({
  appId: pusherConfig.appId,
  key: pusherConfig.key,
  secret: pusherConfig.secret,
  encrypted: pusherConfig.encrypted || false,
  proxy: pusherConfig.proxy || '',
});

LOGGER.info(`Pusher connected to app ${pusherConfig.appId} with key ${pusherConfig.key}`);

function publishNotification(channel, message, data) {
  LOGGER.info(channel, message, data);
  return pusher.trigger(channel, message, data);
}

module.exports.publishNotification = publishNotification;
