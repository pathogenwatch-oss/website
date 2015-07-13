var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var UploadedCollectionStore = require('./UploadedCollectionStore');
var TreeUtils = require('../utils/Tree');

var CHANGE_EVENT = 'change';

var STATIC_DATA = {
  SPECIES_SUBTREES: {
    MRSA252: require('../../static_data/MRSA252.json').tree,
    MW2: require('../../static_data/MW2.json').tree,
    N315: require('../../static_data/N315.json').tree,
    NCTC8325: require('../../static_data/NCTC8325.json').tree,
    Newman: require('../../static_data/Newman.json').tree,
    T0131: require('../../static_data/T0131.json').tree,
    TCH60: require('../../static_data/TCH60.json').tree,
    TCH1516: require('../../static_data/TCH1516.json').tree,
    'e0ce1b47-9928-43fb-9a38-981813b609bc': require('../../static_data/CORE_TREE_RESULT_e0ce1b47-9928-43fb-9a38-981813b609bc.json').newickTree
  }
};

var speciesSubtrees = null;
var activeSpeciesSubtreeId = null;

function setSpeciesSubtrees() {
  speciesSubtrees = STATIC_DATA.SPECIES_SUBTREES;
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
  }

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

    default: // ... do nothing

  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
