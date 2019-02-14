/* global Pusher */

import CONFIG from '../app/config';

let pusher = null;

export function subscribe(channelId, topic, callback) {
  console.log('[Pusher] Subscribing to', channelId, topic);
  if (pusher === null) {
    pusher = new Pusher(CONFIG.pusherKey, { encrypted: true });
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
