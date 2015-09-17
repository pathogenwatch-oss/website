import { EventEmitter } from 'events';
import assign from 'object-assign';
import keyMirror from 'keymirror';

import AppDispatcher from '../dispatcher/AppDispatcher';

import UploadedCollectionStore from './UploadedCollectionStore';
import SubtreeStore from './SubtreeStore';
import ReferenceCollectionStore from './ReferenceCollectionStore';

const CHANGE_EVENT = 'change';

const COLLECTION_STATES = keyMirror({
  NO_COLLECTION_LOADED: null,
  COLLECTION_LOADED: null,
});

const state = COLLECTION_STATES.NO_COLLECTION_LOADED;

const Store = assign({}, EventEmitter.prototype, {

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getCollectionState: function () {
    return state;
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
    emitChange();
    break;

  default: // ... do nothing

  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
