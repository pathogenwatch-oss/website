import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

const CHANGE_EVENT = 'change';

let collection = null;

function emitChange() {
  ReferenceCollectionStore.emit(CHANGE_EVENT);
}

const ReferenceCollectionStore = assign({}, EventEmitter.prototype, {

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getReferenceCollection: function () {
    return collection;
  },

  getReferenceCollectionId: function () {
    return collection.collectionId;
  },

  getAssemblies: function () {
    return this.getReferenceCollection().assemblies;
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
