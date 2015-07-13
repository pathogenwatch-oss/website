var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  setActiveSpeciesSubtreeId: function (activeSpeciesSubtreeId) {

    var action = {
      type: 'set_active_species_subtree_id',
      activeSpeciesSubtreeId: activeSpeciesSubtreeId
    };

    AppDispatcher.dispatch(action);
  }

};
