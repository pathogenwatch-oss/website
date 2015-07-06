var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var STATIC_DATA = {
  UPLOADED_COLLECTION: require('../../static_data/e0ce1b47-9928-43fb-9a38-981813b609bc.json'),
  UPLOADED_COLLECTION_TREE: require('../../static_data/CORE_TREE_RESULT_e0ce1b47-9928-43fb-9a38-981813b609bc.json')
};

var uploadedCollection = null;
var uploadedCollectionTree = null;

function setUploadedCollection(collectionId) {
  uploadedCollection = STATIC_DATA.UPLOADED_COLLECTION;
}

function setUploadedCollectionTree(collectionId) {
  uploadedCollectionTree = STATIC_DATA.UPLOADED_COLLECTION_TREE.newickTree;
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
