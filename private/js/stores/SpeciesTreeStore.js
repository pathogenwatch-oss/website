var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var STATIC_DATA_PATH = '../../static_data/';

var SPECIES_TREE = 'species_tree.nwk';
var SPECIES_SUBTREES = {
  MRSA252: 'MRSA252.nwk',
  MW2: 'MW2.nwk',
  N315: 'N315.nwk',
  NCTC8325: 'NCTC8325.nwk',
  Newman: 'Newman.nwk',
  T0131: 'T0131.nwk',
  TCH60: 'TCH60.nwk',
  TCH1516: 'TCH1516.nwk'
};

var speciesTree = '';
var speciesSubtrees = {};

function setSpeciesTree() {
  speciesTree = require(STATIC_DATA_PATH + SPECIES_TREE);
}

function setSpeciesSubtrees() {
  Object.keys(SPECIES_SUBTREES).forEach(function (speciesSubtreeId) {
    speciesSubtrees[speciesSubtreeId] = require(STATIC_DATA_PATH + speciesSubtreeId + '.nwk');
  });
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
