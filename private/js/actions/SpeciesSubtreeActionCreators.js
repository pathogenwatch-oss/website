var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  setSpeciesSubtrees: function () {

    var action = {
      type: 'set_species_subtrees'
    };

    AppDispatcher.dispatch(action);
  },

  setActiveSpeciesSubtreeId: function (activeSpeciesSubtreeId) {

    var action = {
      type: 'set_active_species_subtree_id',
      activeSpeciesSubtreeId: activeSpeciesSubtreeId
    };

    AppDispatcher.dispatch(action);
  }

};
