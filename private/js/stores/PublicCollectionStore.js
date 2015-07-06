var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var STATIC_DATA = {
  PUBLIC_COLLECTION: require('../../static_data/COLLECTION_dc1027d0-5f1c-4197-b987-26fecf151b47.json'),
};

var publicCollection = null;

function setPublicCollection(collectionId) {
  publicCollection = STATIC_DATA.PUBLIC_COLLECTION;
}

function emitChange() {
  PublicCollectionStore.emit(CHANGE_EVENT);
}

var PublicCollectionStore = assign({}, EventEmitter.prototype, {

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getPublicCollection: function () {
    return publicCollection;
  },

  getPublicCollectionId: function () {
    return publicCollection.collectionId;
  }

});

function handleAction(action) {

  switch (action.type) {

    case 'set_public_collection':
      setPublicCollection(action.collectionId);
      emitChange();
      break;

    default: // ... do nothing

  }
}

PublicCollectionStore.dispatchToken = AppDispatcher.register(handleAction);

module.exports = PublicCollectionStore;
