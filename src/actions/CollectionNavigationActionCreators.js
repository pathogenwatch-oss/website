import AppDispatcher from '../dispatcher/AppDispatcher';

export default {

  setCollectionNavigation: function (collectionNavigation) {
    const action = {
      type: 'set_collection_navigation',
      collectionNavigation: collectionNavigation,
    };

    AppDispatcher.dispatch(action);
  },

};
