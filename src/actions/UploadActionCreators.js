import AppDispatcher from '../dispatcher/AppDispatcher';

import UploadStore from '../stores/UploadStore';
import SocketStore from '../stores/SocketStore';

import FileUploadingActionCreators from '../actions/FileUploadingActionCreators';
import FileUploadingProgressActionCreators from '../actions/FileUploadingProgressActionCreators';

import FileUtils from '../utils/File';
import ApiUtils from '../utils/Api';
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

  getCollectionId: function getCollectionId() {
    FileUploadingActionCreators.startUploadingFiles();
    FileUploadingProgressActionCreators.setNumberOfExpectedResults();

    SocketStore.getSocketConnection().on('assemblyUploadNotification', function (data) {
      console.log('[Macroreact] Received notification:');
      console.dir(data);

      FileUploadingProgressActionCreators.addReceivedResult(data);
    });

    const assemblyNames = UploadStore.getAssemblyNames();
    const roomId = SocketStore.getRoomId();

    const data = {
      assemblyNames: assemblyNames,
      socketRoomId: roomId,
    };

    ApiUtils.getCollectionId(Species.id, data, function (idError, ids) {
      if (idError) {
        console.error(idError);
        return;
      }

      FileUploadingActionCreators.setCollectionId({
        collectionId: ids.collectionId,
        assemblyNameToAssemblyIdMap: ids.assemblyNameToAssemblyIdMap,
      });

      const assemblyNameToAssemblyIdMap = ids.assemblyNameToAssemblyIdMap;
      const assemblyNames = Object.keys(assemblyNameToAssemblyIdMap);
      assemblyNames.forEach(function sendAssembly(assemblyName) {
        const { metadata, fasta } = UploadStore.getAssembly(assemblyName);
        const urlParams = {
          collectionId: ids.collectionId,
          assemblyId: assemblyNameToAssemblyIdMap[assemblyName],
          speciesId: Species.id,
        };
        const requestBody = {
          socketRoomId: roomId,
          metadata: metadata,
          sequences: fasta.assembly,
        };

        ApiUtils.postAssembly(urlParams, requestBody, function (assemblyError) {
          if (assemblyError) {
            console.error(assemblyError);
            return;
          }
        });
      });
    });
  }
};
