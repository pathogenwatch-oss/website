import CONFIG from '../app/config';

export function subscribe(channelId, message, callback) {
  const pusher = new Pusher(CONFIG.pusherKey, { encrypted: true });
  const channel = pusher.subscribe(channelId);
  return channel.bind(message, callback);
}
