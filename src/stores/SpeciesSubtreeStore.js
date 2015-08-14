var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var TreeUtils = require('../utils/Tree');

var CHANGE_EVENT = 'change';

var speciesSubtrees = null;
var activeSpeciesSubtreeId = null;

function setSpeciesSubtrees(subtrees) {
  speciesSubtrees = subtrees;
}

function setActiveSpeciesSubtreeId(speciesSubtreeId) {
  activeSpeciesSubtreeId = speciesSubtreeId;
}

function emitChange() {
  Store.emit(CHANGE_EVENT);
}

var Store = assign({}, EventEmitter.prototype, {

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

  getSpeciesSubtreeIds: function () {
    return Object.keys(speciesSubtrees);
  },

  getActiveSpeciesSubtree: function () {
    var activeSpeciesSubtree = speciesSubtrees[activeSpeciesSubtreeId];
    return activeSpeciesSubtree || null;
  },

  getActiveSpeciesSubtreeId: function () {
    return activeSpeciesSubtreeId;
  },

  getActiveSpeciesSubtreeAssemblyIds: function () {
    var activeSpeciesSubtree = this.getActiveSpeciesSubtree();
    var activeSpeciesSubtreeAssemblyIds = [];

    if (activeSpeciesSubtree) {
      activeSpeciesSubtreeAssemblyIds = TreeUtils.extractIdsFromNewick(activeSpeciesSubtree);
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
      var subtrees = action.collection.collection.subtrees;
      subtrees[action.collection.collection.collectionId] = action.collection.collection.tree;
      setSpeciesSubtrees(subtrees);
      setActiveSpeciesSubtreeId(action.collection.collection.collectionId);
      emitChange();
      break;

    default: // ... do nothing

  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
