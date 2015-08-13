var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  setUploadedCollection: function (collectionId) {

    var action = {
      type: 'set_uploaded_collection',
      collectionId: collectionId
    };

    AppDispatcher.dispatch(action);
  },

  setUploadedCollectionTree: function (collectionId) {

    var action = {
      type: 'set_uploaded_collection_tree',
      collectionId: collectionId
    };

    AppDispatcher.dispatch(action);
  }

};
