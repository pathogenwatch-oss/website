import { EventEmitter } from 'events';
import assign from 'object-assign';

import AppDispatcher from '../dispatcher/AppDispatcher';

const CHANGE_EVENT = 'change';

let speciesTree = null;

function setSpeciesTree(tree) {
  speciesTree = tree;
}

const Store = assign({}, EventEmitter.prototype, {

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getSpeciesTree() {
    return speciesTree;
  },

});

function handleAction(action) {
  switch (action.type) {
  case 'set_species_tree':
    setSpeciesTree(action.tree);
    Store.emitChange();
    break;
  case 'set_collection':
    setSpeciesTree(action.referenceCollection.tree);
    Store.emitChange();
    break;
  default:
    // ... do nothing
  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
