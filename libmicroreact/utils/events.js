const prefix = 'mr.';

export function triggerEvent(eventName, extraParameters = []) {
  window.jQuery(window.document).trigger(prefix + eventName.toLowerCase(), extraParameters);
}

export function listenToEvent(eventName, callback) {
  window.jQuery(window.document).on(prefix + eventName.toLowerCase(), callback);
}

export function unlistenToEvent(eventName) {
  window.jQuery(window.document).on(prefix + eventName.toLowerCase());
}
