import AppDispatcher from '../dispatcher/AppDispatcher';

import UploadStore from '../stores/UploadStore';
import SocketStore from '../stores/SocketStore';

import FileUploadingActionCreators from '../actions/FileUploadingActionCreators';
import FileUploadingProgressActionCreators from '../actions/FileUploadingProgressActionCreators';

import FileUtils from '../utils/File';
import { postAssembly } from '../utils/Api';
import Species from '../species';

module.exports = {

  addFiles: function addFiles(files) {
    const startProcessingFilesAction = {
      type: 'start_processing_files',
    };

    AppDispatcher.dispatch(startProcessingFilesAction);

    FileUtils.parseFiles(files, function (error, rawFiles, assemblies) {
      if (error) {
        console.error(error);
        return;
      }

      const finishProcessingFilesAction = {
        type: 'finish_processing_files',
      };
      const addFilesAction = {
        type: 'add_files',
        rawFiles: rawFiles,
        assemblies: assemblies,
      };

      AppDispatcher.dispatch(finishProcessingFilesAction);
      AppDispatcher.dispatch(addFilesAction);
    });
  },

  getCollectionId() {
    FileUploadingActionCreators.startUploadingFiles();
    FileUploadingProgressActionCreators.setNumberOfExpectedResults();

    const socket = SocketStore.getSocketConnection()

    socket.on('assemblyUploadNotification', function (data) {
      console.log('[WGSA] Received notification:');
      console.dir(data);

      FileUploadingProgressActionCreators.addReceivedResult(data);
    });

    const assemblyNames = UploadStore.getAssemblyNames();
    const roomId = SocketStore.getRoomId();

    const data = {
      assemblyNames: assemblyNames,
      socketRoomId: roomId,
      speciesId: Species.id,
    };

    socket.on('ids', function ({ error, result }) {
      if (error) {
        console.error(error);
        return;
      }

      FileUploadingActionCreators.setCollectionId({
        collectionId: result.collectionId,
        assemblyNameToAssemblyIdMap: result.assemblyNameToAssemblyIdMap,
      });

      const assemblyNameToAssemblyIdMap = result.assemblyNameToAssemblyIdMap;
      Object.keys(assemblyNameToAssemblyIdMap).forEach(
        function sendAssembly(assemblyName) {
          const { metadata, metrics, fasta } = UploadStore.getAssembly(assemblyName);
          const urlParams = {
            collectionId: result.collectionId,
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
            FileUploadingProgressActionCreators.setAssemblyUploaded(urlParams.assemblyId);
          });
        }
      );
    });

    socket.emit('requestIds', data);
  },

};
