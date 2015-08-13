var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  setSpeciesTree: function (tree) {

    var action = {
      type: 'set_species_tree',
      tree: tree
    };

    AppDispatcher.dispatch(action);
  },

  setSpeciesSubtrees: function () {

    var action = {
      type: 'set_species_subtrees'
    };

    AppDispatcher.dispatch(action);
  },

  setActiveSpeciesSubtree: function (speciesSubtree) {

    var action = {
      type: 'set_active_species_subtree',
      speciesSubtree: speciesSubtree
    };

    AppDispatcher.dispatch(action);
  }

};
