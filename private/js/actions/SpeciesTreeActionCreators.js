var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  setSpeciesTree: function () {

    var action = {
      type: 'set_species_tree'
    };

    AppDispatcher.dispatch(action);
  },

  setSpeciesSubtrees: function () {

    var action = {
      type: 'set_species_subtrees'
    };

    AppDispatcher.dispatch(action);
  }

};
