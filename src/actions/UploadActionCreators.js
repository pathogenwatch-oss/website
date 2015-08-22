import AppDispatcher from '../dispatcher/AppDispatcher';

import UploadStore from '../stores/UploadStore';
import SocketStore from '../stores/SocketStore';

import FileUploadingActionCreators from '../actions/FileUploadingActionCreators';
import FileUploadingProgressActionCreators from '../actions/FileUploadingProgressActionCreators';

import FileUtils from '../utils/File';
import ApiUtils from '../utils/Api';


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

  getCollectionId: function getCollectionId() {
    FileUploadingActionCreators.startUploadingFiles();
    FileUploadingProgressActionCreators.setNumberOfExpectedResults();

    SocketStore.getSocketConnection().on('assemblyUploadNotification', function (data) {
      console.log('[Macroreact] Received notification:');
      console.dir(data);

      FileUploadingProgressActionCreators.addReceivedResult(data);
    });

    const fileAssemblyIds = UploadStore.getFileAssemblyIds();
    const roomId = SocketStore.getRoomId();

    const data = {
      userAssemblyIds: fileAssemblyIds,
      socketRoomId: roomId,
    };

    // TODO: Make species Id dynamic
    ApiUtils.getCollectionId('1280', data, function (idError, ids) {
      if (idError) {
        console.error(idError);
        return;
      }

      FileUploadingActionCreators.setCollectionId({
        collectionId: ids.collectionId,
        fileAssemblyIdToAssemblyIdMap: ids.userAssemblyIdToAssemblyIdMap,
      });

      const userAssemblyIdToAssemblyIdMap = ids.userAssemblyIdToAssemblyIdMap;
      const userAssemblyIds = Object.keys(userAssemblyIdToAssemblyIdMap);

      userAssemblyIds.forEach(function sendAssembly(userAssemblyId) {
        const { metadata, fasta } = UploadStore.getAssembly(userAssemblyId);
        const urlParams = {
          collectionId: ids.collectionId,
          assemblyId: userAssemblyIdToAssemblyIdMap[userAssemblyId],
          speciesId: '1280', // TODO: Make this dynamic
        };
        const assemblyData = {
          socketRoomId: roomId,
          metadata: metadata,
          sequences: fasta.assembly,
        };

        console.log('[Macroreact] Prepared assembly data to upload:');
        console.dir(assemblyData);

        ApiUtils.postAssembly(urlParams, assemblyData, function (assemblyError, assemblyResult) {
          if (assemblyError) {
            console.error(assemblyError);
            return;
          }
          console.log('[Macroreact] Uploaded assembly data:');
          console.dir(assemblyResult);
        });
      });
    });
  },

};
