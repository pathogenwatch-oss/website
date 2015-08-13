var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var publicCollection = null;

function setPublicCollection(collection) {
  publicCollection = collection;
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
  },

  getPublicCollectionAssemblies: function () {
    return this.getPublicCollection().assemblies;
  },

  getPublicCollectionAssemblyIds: function () {
    return Object.keys(this.getPublicCollection().assemblies);
  }
});

function handleAction(action) {

  switch (action.type) {

    case 'set_public_collection':
      setPublicCollection(action.collectionId);
      emitChange();
      break;

    case 'set_collection':
      setPublicCollection({
        collectionId: action.referenceCollection.collection.collectioId,
        assemblies: action.referenceCollection.collection.assemblies
      });
      emitChange();
      break;

    default: // ... do nothing

  }
}

PublicCollectionStore.dispatchToken = AppDispatcher.register(handleAction);

module.exports = PublicCollectionStore;
