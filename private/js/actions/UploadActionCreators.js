var AppDispatcher = require('../dispatcher/AppDispatcher');
var FileUtils = require('../utils/File');
var ApiUtils = require('../utils/Api');
var UploadStore = require('../stores/UploadStore');
var SocketStore = require('../stores/SocketStore');
var FileUploadingStore = require('../stores/FileUploadingStore');
var FileUploadingActionCreators = require('../actions/FileUploadingActionCreators');
var FileUploadingProgressActionCreators = require('../actions/FileUploadingProgressActionCreators');

module.exports = {

  addFiles: function addFiles(files) {
    var startProcessingFilesAction = {
      type: 'start_processing_files'
    };

    AppDispatcher.dispatch(startProcessingFilesAction);

    FileUtils.parseFiles(files, function iife(error, rawFiles, assemblies) {

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
    FileUploadingActionCreators.startUploadingFiles();
    FileUploadingProgressActionCreators.setNumberOfExpectedResults();

    SocketStore.getSocketConnection().on('assemblyUploadNotification', function iife(data) {

      console.log('[Macroreact] Received notification:');
      console.dir(data);

      FileUploadingProgressActionCreators.addReceivedResult(data);

    });

    var fileAssemblyIds = UploadStore.getFileAssemblyIds();
    var roomId = SocketStore.getRoomId();

    var data = {
      userAssemblyIds: fileAssemblyIds,
      socketRoomId: roomId
    };

    var assemblyProcessingResults = FileUploadingStore.getAssemblyProcessingResults();
    var collectionProcessingResults = FileUploadingStore.getCollectionProcessingResults();

    ApiUtils.getCollectionId(data, function iife(error, data) {
      if (error) {
        console.error(error);
        return;
      }

      FileUploadingActionCreators.setCollectionId(data.collectionId);

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

        console.log('[Macroreact] Prepared assembly data to upload:');
        console.dir(assemblyData);

        ApiUtils.postAssembly(assemblyData, function iife(error, data) {
          console.log('[Macroreact] Uploaded assembly data:');
          console.dir(data);
        });
      });
    });
  }

};
