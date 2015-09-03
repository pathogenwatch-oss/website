import { EventEmitter }  from 'events';
import assign from 'object-assign';

import AppDispatcher from '../dispatcher/AppDispatcher';

const CHANGE_EVENT = 'change';

let collectionId = null;
let speciesSubtrees = null;
let activeSpeciesSubtreeId = null;

function setCollectionId(id) {
  collectionId = id;
}

function setSpeciesSubtrees(subtrees) {
  speciesSubtrees = subtrees;
}

function setActiveSpeciesSubtreeId(speciesSubtreeId) {
  activeSpeciesSubtreeId = speciesSubtreeId;
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

  getSpeciesSubtree: function (subtreeId) {
    return speciesSubtrees[subtreeId];
  },

  getSpeciesSubtrees: function () {
    return speciesSubtrees;
  },

  getActiveSpeciesSubtree: function () {
    const activeSpeciesSubtree = speciesSubtrees[activeSpeciesSubtreeId];
    return activeSpeciesSubtree || null;
  },

  getActiveSpeciesSubtreeId: function () {
    return activeSpeciesSubtreeId;
  },

  getActiveSpeciesSubtreeAssemblyIds: function () {
    const activeSpeciesSubtree = this.getActiveSpeciesSubtree();
    let activeSpeciesSubtreeAssemblyIds = [];

    if (activeSpeciesSubtree) {
      activeSpeciesSubtreeAssemblyIds = activeSpeciesSubtree.assemblyIds;
    } else {
      activeSpeciesSubtreeAssemblyIds = speciesSubtrees[collectionId].assemblyIds;
    }
    return activeSpeciesSubtreeAssemblyIds;
  },

});

function handleAction(action) {
  switch (action.type) {
  case 'set_species_subtrees':
    setSpeciesSubtrees();
    emitChange();
    break;

  case 'set_active_species_subtree_id':
    setActiveSpeciesSubtreeId(action.activeSpeciesSubtreeId);
    emitChange();
    break;

  case 'set_collection':
    setCollectionId(action.collection.collectionId);

    const subtrees = action.collection.subtrees;
    // TODO: Remove hack
    subtrees[collectionId] = {
      newick: action.collection.tree,
      assemblyIds: Object.keys(action.collection.assemblies),
    };
    setSpeciesSubtrees(subtrees);

    setActiveSpeciesSubtreeId(collectionId);

    emitChange();
    break;

  default:
    // ... do nothing
  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
