var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var STATIC_DATA = {
  SPECIES_TREE: require('../../static_data/species_tree.json').tree
};

var speciesTree = null;

function setSpeciesTree() {
  speciesTree = STATIC_DATA.SPECIES_TREE;
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

  getSpeciesTree: function () {
    return speciesTree;
  }

});

function handleAction(action) {

  switch (action.type) {

    case 'set_species_tree':
      setSpeciesTree();
      emitChange();
      break;

    default: // ... do nothing

  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
