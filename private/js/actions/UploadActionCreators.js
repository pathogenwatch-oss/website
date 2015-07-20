var AppDispatcher = require('../dispatcher/AppDispatcher');
var FileUtils = require('../utils/File');
var ApiUtils = require('../utils/Api');
var UploadStore = require('../stores/UploadStore');
var SocketStore = require('../stores/SocketStore');

module.exports = {

  addFiles: function addFiles(files) {
    var startProcessingFilesAction = {
      type: 'start_processing_files'
    };

    AppDispatcher.dispatch(startProcessingFilesAction);

    FileUtils.parseFiles(files, function iife(error, rawFiles, assemblies) {
      console.log('[Macroreact dev] rawFiles:');
      console.dir(rawFiles);

      console.log('[Macroreact dev] assemblies:');
      console.dir(assemblies);

      var finishProcessingFilesAction = {
        type: 'finish_processing_files'
      };

      var addFilesAction = {
        type: 'add_files',
        rawFiles: rawFiles,
        assemblies: assemblies
      };

      AppDispatcher.dispatch(finishProcessingFilesAction);
      AppDispatcher.dispatch(addFilesAction);
    });
  },

  getCollectionId: function getCollectionId() {
    var fileAssemblyIds = UploadStore.getFileAssemblyIds();
    var roomId = SocketStore.getRoomId();

    var data = {
      userAssemblyIds: fileAssemblyIds,
      socketRoomId: roomId
    };

    ApiUtils.getCollectionId(data, function iife(error, data) {
      if (error) {
        console.error(error);
        return;
      }

      var userAssemblyIdToAssemblyIdMap = data.userAssemblyIdToAssemblyIdMap;
      var userAssemblyIds = Object.keys(userAssemblyIdToAssemblyIdMap);

      userAssemblyIds.forEach(function sendAssembly(userAssemblyId) {
        var roomId = SocketStore.getRoomId();
        var assemblyData = {
          socketRoomId: roomId,
          collectionId: data.collectionId,
          assemblyId: userAssemblyIdToAssemblyIdMap[userAssemblyId],
          metadata: UploadStore.getAssembly(userAssemblyId).metadata,
          sequences: UploadStore.getAssembly(userAssemblyId).fasta.assembly
        };

        ApiUtils.postAssembly(assemblyData, function iife(error, data) {
          console.log('OK');
          console.dir(data);
        });
      });
    });
  }

};
