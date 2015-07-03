var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var STATIC_DATA = {
  SPECIES_TREE: require('../../static_data/species_tree.json').tree,
  SPECIES_SUBTREES: {
    MRSA252: require('../../static_data/MRSA252.json').tree,
    MW2: require('../../static_data/MW2.json').tree,
    N315: require('../../static_data/N315.json').tree,
    NCTC8325: require('../../static_data/NCTC8325.json').tree,
    Newman: require('../../static_data/Newman.json').tree,
    T0131: require('../../static_data/T0131.json').tree,
    TCH60: require('../../static_data/TCH60.json').tree,
    TCH1516: require('../../static_data/TCH1516.json').tree
  }
};

var speciesTree = '';
var speciesSubtrees = {};

function setSpeciesTree() {
  speciesTree = STATIC_DATA.SPECIES_TREE;
}

function setSpeciesSubtrees() {
  speciesSubtrees = STATIC_DATA.SPECIES_SUBTREES

  console.dir(STATIC_DATA);
}

function emitChange() {
  SpeciesTreeStore.emit(CHANGE_EVENT);
}

var SpeciesTreeStore = assign({}, EventEmitter.prototype, {

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getSpeciesTree: function () {
    return speciesTree;
  },

  getSpeciesSubTree: function (subtreeId) {
    return speciesSubtrees[subtreeId];
  }

});

function handleAction(action) {

  switch (action.type) {

    case 'set_species_tree':
      setSpeciesTree();
      emitChange();
      break;

    case 'set_species_subtrees':
      setSpeciesSubtrees();
      emitChange();
      break;

    default: // ... do nothing

  }
}

SpeciesTreeStore.dispatchToken = AppDispatcher.register(handleAction);

module.exports = SpeciesTreeStore;
