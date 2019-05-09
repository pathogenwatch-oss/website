/* global Pusher */

import config from '../app/config';

const { key, cluster } = config.pusher || {};

let pusher = null;

export function subscribe(channelId, topic, callback) {
  console.log('[Pusher] Subscribing to', channelId, topic);
  if (pusher === null) {
    pusher = new Pusher(key, { cluster, encrypted: true });
  }

  const channel = pusher.subscribe(channelId);
  return channel.bind(topic, callback);
}

export function unsubscribe(channelId) {
  console.log('[Pusher] Unsubscribing from', channelId);
  if (pusher === null) return;
  pusher.unsubscribe(channelId);
  pusher = null;
}
