/* global Pusher */

import config from '../app/config';

const { key, cluster } = config.pusher || {};

let pusher = null;

export function subscribe(channelId, message, callback) {
  console.log('[Pusher] Subscribing to', channelId, message);
  if (pusher === null) {
    pusher = new Pusher(key, { cluster, encrypted: true });
  }

  const channel = pusher.subscribe(channelId);
  return channel.bind(message, callback);
}

export function unsubscribe(channelId) {
  console.log('[Pusher] Unsubscribing from', channelId);
  if (pusher === null) return;
  pusher.unsubscribe(channelId);
  pusher = null;
}
