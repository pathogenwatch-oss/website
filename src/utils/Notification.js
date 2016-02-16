import CONFIG from '../config';

export function subscribe(channel, message, callback) {
  const pusher = new Pusher(CONFIG.pusher.key, { encrypted CONFIG.pusher.encrypted });
  const channel = pusher.subscribe(channel);
  return channel.bind(message, callback);
}
