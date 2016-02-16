import AppDispatcher from '../dispatcher/AppDispatcher';

import UploadStore from '../stores/UploadStore';

import FileUtils from '../utils/File';
import { getCollectionId } from '../utils/Api';
import Species from '../species';

module.exports = {

  addFiles(files, callback) {
    FileUtils.parseFiles(files, function (error, rawFiles, assemblies) {
      if (error) {
        // TODO: Toast message?
        console.error(error);
        return;
      }

      const addFilesAction = {
        type: 'add_files',
        rawFiles: rawFiles,
        assemblies: assemblies,
      };

      AppDispatcher.dispatch(addFilesAction);
      callback();
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

};
