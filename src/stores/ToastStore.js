import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

const CHANGE_EVENT = 'change';

let toast = null;

function showToast(data) {
  toast = data;
}

function hideToast() {
  toast = null;
}

const Store = assign({}, EventEmitter.prototype, {
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getToast() {
    return toast || {};
  },
});

function emitChange() {
  Store.emit(CHANGE_EVENT);
}

function handleAction(action) {
  switch (action.type) {

    case 'show_toast':
      showToast(action.toast);
      emitChange();
      break;

    case 'hide_toast':
      hideToast();
      emitChange();
      break;

    default:
      // ... do nothing

  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

export default Store;
