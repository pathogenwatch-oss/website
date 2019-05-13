/* global Pusher */

import config from '../app/config';

const { key, cluster } = config.pusher || {};

let pusher = null;

export function subscribe(channelId, topic, callback) {
  if (pusher === null) {
    console.log('[Pusher] Connecting');
    pusher = new Pusher(key, { cluster, encrypted: true });
  }

  console.log('[Pusher] Subscribing to', channelId, topic);
  const channel = pusher.subscribe(channelId);
  return channel.bind(topic, callback);
}

export function unsubscribe(channelId) {
  console.log('[Pusher] Unsubscribing from', channelId);
  if (pusher === null) return;
  pusher.unsubscribe(channelId);
  if (pusher.allChannels().length === 0) {
    console.log('[Pusher] Disconnecting');
    pusher.disconnect();
    pusher = null;
  }
}
