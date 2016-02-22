import AppDispatcher from '../dispatcher/AppDispatcher';

import UploadStore from '../stores/UploadStore';
import SocketStore from '../stores/SocketStore';

import FileUploadingActionCreators from '../actions/FileUploadingActionCreators';
import FileUploadingProgressActionCreators from '../actions/FileUploadingProgressActionCreators';

import FileUtils from '../utils/File';
import { getCollectionId, postAssembly } from '../utils/Api';
import Species from '../species';

module.exports = {

  startProcessingFiles() {
    AppDispatcher.dispatch({
      type: 'start_processing_files',
    });
  },

  addFiles(assemblies) {
    AppDispatcher.dispatch({
      type: 'add_files',
      assemblies,
    });
  },

  finishProcessingFiles() {
    AppDispatcher.dispatch({
      type: 'finish_processing_files',
    });
  },

  getCollectionId() {
    FileUploadingActionCreators.startUploadingFiles();
    FileUploadingProgressActionCreators.setNumberOfExpectedResults();

    SocketStore.getSocketConnection().on('assemblyUploadNotification', function (data) {
      console.log('[WGSA] Received notification:');
      console.dir(data);

      FileUploadingProgressActionCreators.addReceivedResult(data);
    });

    const assemblyNames = UploadStore.getAssemblyNames();
    const roomId = SocketStore.getRoomId();

    const data = {
      assemblyNames: assemblyNames,
      socketRoomId: roomId,
    };

    getCollectionId(Species.id, data, function (idError, ids) {
      if (idError) {
        console.error(idError);
        return;
      }

      FileUploadingActionCreators.setCollectionId({
        collectionId: ids.collectionId,
        assemblyNameToAssemblyIdMap: ids.assemblyNameToAssemblyIdMap,
      });

      const assemblyNameToAssemblyIdMap = ids.assemblyNameToAssemblyIdMap;
      Object.keys(assemblyNameToAssemblyIdMap).forEach(
        function sendAssembly(assemblyName) {
          const { metadata, metrics, fasta } = UploadStore.getAssembly(assemblyName);
          const urlParams = {
            collectionId: ids.collectionId,
            assemblyId: assemblyNameToAssemblyIdMap[assemblyName],
            speciesId: Species.id,
          };
          const requestBody = {
            socketRoomId: roomId,
            sequences: fasta.assembly,
            metadata,
            metrics,
          };

          postAssembly(urlParams, requestBody, function (assemblyError) {
            if (assemblyError) {
              console.error(assemblyError);
              return;
            }
          });
        }
      );
    });
  },

};
