var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var keyMirror = require('keymirror');

// var UploadedCollectionStore = require('./UploadedCollectionStore');
// var SpeciesTreeStore = require('./SpeciesTreeStore');
// var SpeciesSubtreeStore = require('./SpeciesSubtreeStore');
// var PublicCollectionStore = require('./PublicCollectionStore');

var CHANGE_EVENT = 'change';

var PROJECT_NAVIGATION_STATES = keyMirror({
  TABLE_METADATA: null,
  TABLE_RESISTANCE_PROFILE: null
});

var state = PROJECT_NAVIGATION_STATES.TABLE_METADATA;

function setProjectNavigation(projectNavigationState) {
  state = projectNavigationState;
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

  getProjectNavigation: function () {
    return state;
  },

  getProjectNavigationStates: function () {
    return PROJECT_NAVIGATION_STATES;
  }

});

function handleAction(action) {

  switch (action.type) {

    case 'set_project_navigation':
      setProjectNavigation(action.projectNavigation);
      emitChange();
      break;

    default: // ... do nothing

  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
