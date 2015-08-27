import AppDispatcher from '../dispatcher/AppDispatcher';

export default {

  setSpeciesTree: function (tree) {
    AppDispatcher.dispatch({
      type: 'set_species_tree',
      tree: tree,
    });
  },

  setSpeciesSubtrees: function () {
    AppDispatcher.dispatch({
      type: 'set_species_subtrees',
    });
  },

  setActiveSpeciesSubtree: function (speciesSubtree) {
    AppDispatcher.dispatch({
      type: 'set_active_species_subtree',
      speciesSubtree: speciesSubtree,
    });
  },

};
