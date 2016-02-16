import CONFIG from '../config';

export function subscribe(channelId, message, callback) {
  const pusher = new Pusher(CONFIG.pusher.key, { encrypted: CONFIG.pusher.encrypted });
  const channel = pusher.subscribe(channelId);
  return channel.bind(message, callback);
}
