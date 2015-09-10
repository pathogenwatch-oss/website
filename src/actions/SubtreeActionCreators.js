import AppDispatcher from '../dispatcher/AppDispatcher';

module.exports = {

  setActiveSubtreeId: function (activeSubtreeId) {
    const action = {
      type: 'set_active_species_subtree_id',
      activeSubtreeId: activeSubtreeId,
    };

    AppDispatcher.dispatch(action);
  }

};
