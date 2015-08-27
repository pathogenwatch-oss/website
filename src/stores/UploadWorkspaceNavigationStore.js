var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var UploadStore = require('./UploadStore');

var CHANGE_EVENT = 'change';

var fileAssemblyId = null;

function setFileAssemblyId(id) {
  fileAssemblyId = id;
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

  getFileAssemblyId: function () {
    return fileAssemblyId;
  }

});

function handleAction(action) {

  switch (action.type) {

    case 'navigate_to_assembly':
      console.log(action);
      setFileAssemblyId(action.fileAssemblyId);
      emitChange();
      break;

    default: // ... do nothing

  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
