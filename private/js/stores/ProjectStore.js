var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var keyMirror = require('keymirror');

var UploadedCollectionStore = require('./UploadedCollectionStore');
var SpeciesTreeStore = require('./SpeciesTreeStore');
var SpeciesSubtreeStore = require('./SpeciesSubtreeStore');
var PublicCollectionStore = require('./PublicCollectionStore');

var CHANGE_EVENT = 'change';

var PROJECT_STATES = keyMirror({
  NO_PROJECT_LOADED: null,
  PROJECT_LOADED: null
});

var state = PROJECT_STATES.NO_PROJECT_LOADED;

function setProject() {
  state = PROJECT_STATES.PROJECT_LOADED;
}

function emitChange() {
  Store.emit(CHANGE_EVENT);
}

var Store = assign({}, EventEmitter.prototype, {

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getProjectState: function () {
    return state;
  }
});

function handleAction(action) {

  switch (action.type) {

    case 'set_collection':
      AppDispatcher.waitFor([
        PublicCollectionStore.dispatchToken,
        SpeciesSubtreeStore.dispatchToken,
        SpeciesTreeStore.dispatchToken,
        UploadedCollectionStore.dispatchToken
      ]);
      emitChange();
      break;

    default: // ... do nothing

  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
