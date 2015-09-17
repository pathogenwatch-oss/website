import { EventEmitter }  from 'events';
import assign from 'object-assign';

import AppDispatcher from '../dispatcher/AppDispatcher';

const CHANGE_EVENT = 'change';

let subtrees = null;
let activeSubtreeId = null;


function setSubtrees(newSubtrees) {
  subtrees = newSubtrees;
}

function setActiveSubtreeId(SubtreeId) {
  activeSubtreeId = SubtreeId;
}

function emitChange() {
  Store.emit(CHANGE_EVENT);
}

const Store = assign({}, EventEmitter.prototype, {

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getSubtree: function (subtreeId) {
    return subtrees[subtreeId];
  },

  getSubtrees: function () {
    return subtrees;
  },

  getActiveSubtree: function () {
    const activeSubtree = subtrees[activeSubtreeId];
    return activeSubtree || null;
  },

  getActiveSubtreeId: function () {
    return activeSubtreeId;
  },

  getActiveSubtreeAssemblyIds: function () {
    const subtree = this.getActiveSubtree();
    return subtree ? subtree.assemblyIds : [];
  },

});

function handleAction(action) {
  switch (action.type) {
  case 'set_species_subtrees':
    setSubtrees();
    emitChange();
    break;

  case 'set_active_species_subtree_id':
    setActiveSubtreeId(action.activeSubtreeId);
    emitChange();
    break;

  case 'set_collection':
    setSubtrees(action.collection.subtrees);
    emitChange();
    break;

  default:
    // ... do nothing
  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
