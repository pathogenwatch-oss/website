import { EventEmitter } from 'events';
import assign from 'object-assign';
import keyMirror from 'keymirror';

import AppDispatcher from '../dispatcher/AppDispatcher';

const CHANGE_EVENT = 'change';

const COLLECTION_NAVIGATION_STATES = keyMirror({
  TABLE_METADATA: null,
  TABLE_RESISTANCE_PROFILE: null,
});

let state = COLLECTION_NAVIGATION_STATES.TABLE_METADATA;

function setCollectionNavigation(collectionNavigationState) {
  state = collectionNavigationState;
}

const Store = assign({}, EventEmitter.prototype, {

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getCollectionNavigation: function () {
    return state;
  },

  getCollectionNavigationStates: function () {
    return COLLECTION_NAVIGATION_STATES;
  },

});

function emitChange() {
  Store.emit(CHANGE_EVENT);
}

function handleAction(action) {
  switch (action.type) {

  case 'set_collection_navigation':
    setCollectionNavigation(action.collectionNavigation);
    emitChange();
    break;

  default: // ... do nothing

  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
