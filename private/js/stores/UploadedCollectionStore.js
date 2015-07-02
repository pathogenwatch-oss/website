var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var STATIC_DATA_PATH = '../../static_data/';
// var UPLOADED_COLLECTION: 'e0ce1b47-9928-43fb-9a38-981813b609bc.json';
// var UPLOADED_COLLECTION_TREE: 'CORE_TREE_RESULT_e0ce1b47-9928-43fb-9a38-981813b609bc.json';

var uploadedCollection = {};
var uploadedCollectionTree = {};

function setUploadedCollection(collectionId) {
  uploadedCollection = JSON.parse(require(STATIC_DATA_PATH + collectionId + '.json'));
}

function setUploadedCollectionTree(collectionId) {
  uploadedCollectionTree = JSON.parse(require(STATIC_DATA_PATH + 'CORE_TREE_RESULT_' + collectionId + '.json'));
}

function emitChange() {
  UploadedCollectionStore.emit(CHANGE_EVENT);
}

var UploadedCollectionStore = assign({}, EventEmitter.prototype, {

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getUploadedCollection: function () {
    return uploadedCollection;
  },

  getUploadedCollectionTree: function () {
    return uploadedCollectionTree;
  }

});

function handleAction(action) {

  switch (action.type) {

    case 'set_uploaded_collection':
      setUploadedCollection(action.collectionId);
      emitChange();
      break;

    case 'set_uploaded_collection_tree':
      setUploadedCollectionTree(action.collectionId);
      emitChange();
      break;

    default: // ... do nothing

  }
}

UploadedCollectionStore.dispatchToken = AppDispatcher.register(handleAction);

module.exports = UploadedCollectionStore;
