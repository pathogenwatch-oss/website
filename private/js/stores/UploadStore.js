var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var rawFiles = {};
var assemblies = {};

function addFiles(newRawFiles, newAssemblies) {
  assign(rawFiles, newRawFiles);
  assign(assemblies, newAssemblies);
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

  getAssemblies: function () {
    return assemblies;
  },

  getAssembly: function (fileAssemblyId) {
    return (assemblies[fileAssemblyId] || null);
  },

  getFileAssemblyIds: function () {
    return Object.keys(this.getAssemblies());
  },

  getFirstFileAssemblyId: function () {
    return this.getFileAssemblyIds()[0] || null;
  }
});

function handleAction(action) {

  switch (action.type) {

    case 'add_files':
      addFiles(action.rawFiles, action.assemblies);
      emitChange();
      break;

    default: // ... do nothing
  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
