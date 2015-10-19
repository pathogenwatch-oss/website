import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

const CHANGE_EVENT = 'change';

let collection = null;
let assemblyIds = [];

const UploadedCollectionStore = assign({}, EventEmitter.prototype, {

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getCollection() {
    return collection;
  },

  getCollectionId() {
    return collection.collectionId;
  },

  getAssemblies() {
    return this.getCollection().assemblies;
  },

  getAssemblyIds() {
    return assemblyIds;
  },

  getTree() {
    return collection.tree;
  },

  getUserTree() {
    const assemblies = this.getAssemblies();
    return assemblyIds.reduce(function (tree, assemblyId) {
      const { assemblyName } = assemblies[assemblyId].metadata;
      return tree.replace(assemblyId, assemblyName);
    }, this.getTree());
  },

  contains(assemblyId) {
    return (
      assemblyIds.indexOf(assemblyId) > -1
    );
  },

});

function emitChange() {
  UploadedCollectionStore.emit(CHANGE_EVENT);
}

function handleAction(action) {
  switch (action.type) {

  case 'set_collection':
    collection = action.collection;
    assemblyIds = Object.keys(collection.assemblies);
    emitChange();
    break;

  default:
    // ... do nothing

  }
}

UploadedCollectionStore.dispatchToken = AppDispatcher.register(handleAction);

export default UploadedCollectionStore;
