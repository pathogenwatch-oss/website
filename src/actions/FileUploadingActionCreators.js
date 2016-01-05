import  AppDispatcher from '../dispatcher/AppDispatcher';

export default {

  startUploadingFiles: function () {
    const action = {
      type: 'start_uploading_files',
    };

    AppDispatcher.dispatch(action);
  },

  finishUploadingFiles: function (result) {
    const action = {
      type: 'finish_uploading_files',
      result: result,
    };

    AppDispatcher.dispatch(action);
  },

  setCollectionId: function (collection) {
    const action = {
      type: 'set_collection_id',
      collectionId: collection.collectionId,
      assemblyNameToAssemblyIdMap: collection.assemblyNameToAssemblyIdMap,
    };

    AppDispatcher.dispatch(action);
  },

};
