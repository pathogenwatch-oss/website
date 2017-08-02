/* global Pusher */

import CONFIG from '../app/config';

let pusher = null;

export function subscribe(channelId, message, callback) {
  console.log('[Pusher] Subscribing to', channelId, message);
  if (pusher === null) {
    pusher = new Pusher(CONFIG.pusherKey, { encrypted: true });
  }

  return new Promise((resolve) => {
    let channel = null;
    pusher.connection.bind('connected', () => {
      resolve(channel.bind(message, callback));
    });
    channel = pusher.subscribe(channelId);
  });
}

export function unsubscribe(channelId) {
  console.log('[Pusher] Unsubscribing from', channelId);
  if (pusher === null) return;
  pusher.unsubscribe(channelId);
  pusher = null;
}
