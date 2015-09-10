var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var UploadStore = require('./UploadStore');

var CHANGE_EVENT = 'change';

var metadata = {
  date: {
    year: null,
    month: null,
    day: null
  },
  source: null,
  geography: {
    location: null,
    position: {
      latitude: null,
      longitude: null
    }
  }
};

function setassemblyName(id) {
  assemblyName = id;
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

  getAssemblyName: function () {
    return assemblyName;
  }
});

function handleAction(action) {

  switch (action.type) {

    case 'add_files':
      AppDispatcher.waitFor([
        UploadStore.dispatchToken
      ]);

      setassemblyName(UploadStore.getFirstAssemblyName());
      emitChange();
      break;

    case 'navigate_to_assembly':
      setassemblyName(action.assemblyName);
      emitChange();
      break;

    default: // ... do nothing

  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
