import AppDispatcher from '../dispatcher/AppDispatcher';

module.exports = {

  setActiveSpeciesSubtreeId: function (activeSpeciesSubtreeId) {
    const action = {
      type: 'set_active_species_subtree_id',
      activeSpeciesSubtreeId: activeSpeciesSubtreeId,
    };

    AppDispatcher.dispatch(action);
  }

};
