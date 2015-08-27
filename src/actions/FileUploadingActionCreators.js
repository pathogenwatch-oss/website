var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  startUploadingFiles: function () {
    var action = {
      type: 'start_uploading_files'
    };

    AppDispatcher.dispatch(action);
  },

  finishUploadingFiles: function (result) {
    var action = {
      type: 'finish_uploading_files',
      result: result
    };

    AppDispatcher.dispatch(action);
  },

  setCollectionId: function (collection) {
    var action = {
      type: 'set_collection_id',
      collectionId: collection.collectionId,
      fileAssemblyIdToAssemblyIdMap: collection.fileAssemblyIdToAssemblyIdMap,
    };

    AppDispatcher.dispatch(action);
  }

};
