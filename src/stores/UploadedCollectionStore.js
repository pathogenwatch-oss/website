import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

const CHANGE_EVENT = 'change';

let collection = null;

function emitChange() {
  UploadedCollectionStore.emit(CHANGE_EVENT);
}

const UploadedCollectionStore = assign({}, EventEmitter.prototype, {

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getCollection: function () {
    return collection;
  },

  getCollectionId: function () {
    return collection.collectionId;
  },

  getAssemblies: function () {
    return this.getCollection().assemblies;
  },

  getTree: function () {
    return collection.tree;
  },

  getUserTree: function () {
    const assemblies = this.getAssemblies();
    return Object.keys(assemblies).reduce(function (tree, assemblyId) {
      const { assemblyName } = assemblies[assemblyId].metadata;
      return tree.replace(assemblyId, assemblyName);
    }, this.getTree());
  },

  contains(assemblyId) {
    return (
      Object.keys(this.getAssemblies()).indexOf(assemblyId) > -1
    );
  },

});

function handleAction(action) {
  switch (action.type) {

  case 'set_collection':
    collection = action.collection;
    emitChange();
    break;

  default:
    // ... do nothing

  }
}

UploadedCollectionStore.dispatchToken = AppDispatcher.register(handleAction);

module.exports = UploadedCollectionStore;
