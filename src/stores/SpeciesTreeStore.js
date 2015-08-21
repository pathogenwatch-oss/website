import { EventEmitter } from 'events';
import assign from 'object-assign';

import AppDispatcher from '../dispatcher/AppDispatcher';

const CHANGE_EVENT = 'change';

let speciesTree = null;
let subspeciesMap = null;

function setSpeciesTree(tree) {
  speciesTree = tree;
}

function setSubspeciesMap(assemblyIdMap) {
  subspeciesMap = Object.keys(assemblyIdMap).reduce(function (map, assemblyId) {
    const speciesTreeTaxon = assemblyIdMap[assemblyId];
    const taxonAssemblyIds = map[speciesTreeTaxon] || [];

    taxonAssemblyIds.push(assemblyId);
    map[speciesTreeTaxon] = taxonAssemblyIds;

    return map;
  }, {});
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

  getSubspeciesMap() {
    return subspeciesMap;
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
    setSubspeciesMap(action.collection.assemblyIdMap);
    Store.emitChange();
    break;
  default:
    // ... do nothing
  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
