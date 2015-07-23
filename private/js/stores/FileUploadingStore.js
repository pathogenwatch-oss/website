var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var keyMirror = require('keymirror');

var CHANGE_EVENT = 'change';

var ASSEMBLY_PROCESSING_RESULTS = keyMirror({
  UPLOAD_OK: null,
  METADATA_OK: null,
  SCCMEC: null,
  PAARSNP_RESULT: null,
  MLST_RESULT: null,
  CORE_RESULT: null,
  FP_COMP: null
});

var COLLECTION_PROCESSING_RESULTS = keyMirror({
  PHYLO_MATRIX: null,
  CORE_MUTANT_TREE: null,
  SUBMATRIX: null
});

var STATES = keyMirror({
  NOT_UPLOADING_FILES: null,
  UPLOADING_FILES: null
});

var RESULTS = keyMirror({
  NONE: null,
  SUCCESS: null,
  ERROR: null,
  ABORT: null
});

var fileUploadingState = STATES.NOT_UPLOADING_FILES;
var fileUploadingResult = RESULTS.NONE;
var collectionId = null;

function setFileUploadingState(state) {
  fileUploadingState = state;
}

function setFileUploadingResult(result) {
  fileUploadingResult = result;
}

function setCollectionId(id) {
  collectionId = id;
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

  getFileUploadingState: function () {
    return fileUploadingState;
  },

  getFileUploadingResult: function () {
    return fileUploadingResult;
  },

  getFileUploadingResults: function () {
    return RESULTS;
  },

  getAssemblyProcessingResults: function () {
    return ASSEMBLY_PROCESSING_RESULTS;
  },

  getCollectionProcessingResults: function () {
    return COLLECTION_PROCESSING_RESULTS;
  },

  getCollectionId: function () {
    return collectionId;
  }
});

function handleAction(action) {

  switch (action.type) {

    case 'start_uploading_files':
      setFileUploadingState(STATES.UPLOADING_FILES);
      emitChange();
      break;

    case 'finish_uploading_files':
      setFileUploadingState(STATES.NOT_UPLOADING_FILES);
      setFileUploadingResult(action.result);
      emitChange();
      break;

    case 'set_collection_id':
      setCollectionId(action.collectionId);
      emitChange();
      break;

    default: // ... do nothing

  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
