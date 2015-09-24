import { EventEmitter } from 'events';
import assign from 'object-assign';
import keyMirror from 'keymirror';

import AppDispatcher from '../dispatcher/AppDispatcher';

import UploadedCollectionStore from './UploadedCollectionStore';
import SubtreeStore from './SubtreeStore';
import ReferenceCollectionStore from './ReferenceCollectionStore';

const CHANGE_EVENT = 'change';

const STATES = keyMirror({
  LOADED: null,
  ERROR: null,
});

let state = null;

const Store = assign({}, EventEmitter.prototype, {

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  status() {
    return state;
  },

  get states() {
    return STATES;
  },

});

function emitChange() {
  Store.emit(CHANGE_EVENT);
}

function handleAction(action) {
  switch (action.type) {

  case 'set_collection':
    AppDispatcher.waitFor([
      ReferenceCollectionStore.dispatchToken,
      SubtreeStore.dispatchToken,
      UploadedCollectionStore.dispatchToken,
    ]);
    state = STATES.LOADED;
    emitChange();
    break;

  case 'collection_error':
    state = STATES.ERROR;
    emitChange();
    break;

  default: // ... do nothing

  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
