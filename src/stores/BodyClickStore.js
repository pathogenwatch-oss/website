import { EventEmitter } from 'events';
import assign from 'object-assign';

import AppDispatcher from '../dispatcher/AppDispatcher';

const CHANGE_EVENT = 'change';

let event = null;

const Store = assign({}, EventEmitter.prototype, {

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getEvent() {
    return event;
  },

});

function emitChange() {
  Store.emit(CHANGE_EVENT);
}

function handleAction(action) {
  switch (action.type) {

  case 'body_click':
    event = action.event;
    emitChange();
    break;

  default:
    // ... do nothing

  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

export default Store;
