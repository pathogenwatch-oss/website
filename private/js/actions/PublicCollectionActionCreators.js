var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  setPublicCollection: function (collectionId) {
    var action = {
      type: 'set_public_collection',
      collectionId: collectionId
    };

    AppDispatcher.dispatch(action);
  }

};
