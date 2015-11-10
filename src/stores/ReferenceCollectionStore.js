import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

const CHANGE_EVENT = 'change';

let collection = null;

const ReferenceCollectionStore = assign({}, EventEmitter.prototype, {

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

  contains(assemblyId) {
    return (
      Object.keys(this.getAssemblies()).indexOf(assemblyId) > -1
    );
  },

  getTree() {
    return collection.tree;
  },

});

function emitChange() {
  ReferenceCollectionStore.emit(CHANGE_EVENT);
}

function handleAction(action) {
  switch (action.type) {

  case 'set_collection':
    collection = action.referenceCollection;
    emitChange();
    break;

  default:
    // ... do nothing

  }
}

ReferenceCollectionStore.dispatchToken = AppDispatcher.register(handleAction);

module.exports = ReferenceCollectionStore;
