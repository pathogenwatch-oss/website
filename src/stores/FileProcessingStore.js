var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var STATES = {
  PROCESSING_FILES: true,
  NOT_PROCESSING_FILES: false
};

var fileProcessingState = STATES.NOT_PROCESSING_FILES;

function setFileProcessingState(state) {
  fileProcessingState = state;
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

  getFileProcessingState: function () {
    return fileProcessingState;
  }
});

function handleAction(action) {

  switch (action.type) {

  case 'start_processing_files':
    setFileProcessingState(STATES.PROCESSING_FILES);
    emitChange();
    break;

  case 'finish_processing_files':
    setFileProcessingState(STATES.NOT_PROCESSING_FILES);
    emitChange();
    break;

  default: // ... do nothing

  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
