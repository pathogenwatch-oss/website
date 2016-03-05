import AppDispatcher from '../dispatcher/AppDispatcher';

import UploadStore from '../stores/UploadStore';

import { getCollectionId } from '../utils/Api';
import Species from '../species';

module.exports = {

  addFiles(assemblies) {
    AppDispatcher.dispatch({
      type: 'add_files',
      assemblies,
    });
  },

  getCollectionId() {
    const assemblyNames = UploadStore.getAssemblyNames();

    getCollectionId(Species.id, { assemblyNames }, function (error, result) {
      if (error) {
        // TODO: Pass error to front end
        console.error(error);
        return;
      }

      const { collectionId, assemblyNameToAssemblyIdMap } = result;

      AppDispatcher.dispatch({
        type: 'set_collection_ids',
        collectionId,
        assemblyNameToAssemblyIdMap,
      });
    });
  },

  deleteAssembly(assemblyName) {
    AppDispatcher.dispatch({
      type: 'delete_assembly',
      assemblyName,
    });
  },

  notifyUploadFailed() {
    AppDispatcher.dispatch({
      type: 'notify_upload_failed',
    });
  },

};
