var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var STATIC_DATA_PATH = '../../static_data/';
//var PUBLIC_COLLECTION = 'dc1027d0-5f1c-4197-b987-26fecf151b47.json';

var publicCollection = {};

function setPublicCollection(collectionId) {
  publicCollection = JSON.parse(require(STATIC_DATA_PATH + collectionId + '.json'));
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
