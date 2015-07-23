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
    FileUploadingActionCreators.startUploadingFiles();
    FileUploadingProgressActionCreators.setNumberOfExpectedResults();

    //var numberOfExpectedResults = UploadStore.getFileAssemblyIds().length * Object.keys(FileUploadingStore.getAssemblyProcessingResults()).length + Object.keys(FileUploadingStore.getCollectionProcessingResults()).length - 1;
    //var receivedResults = {};

    SocketStore.getSocketConnection().on('assemblyUploadNotification', function iife(data) {

      var receivedResult = data.assemblyId + '__' + data.result;

      FileUploadingProgressActionCreators.addReceivedResult(receivedResult);

      console.log('Notification:');
      console.dir(data);

      //receivedResults[data.assemblyId + '__' + data.result] = true;

      // console.log('Number of received results: ' + Object.keys(receivedResults).length);
      // console.log('Number of expected results: ' + numberOfExpectedResults);

      // if (Object.keys(receivedResults).length === numberOfExpectedResults) {
      //   console.log('+++ Received ALL results!');
      //
      //   FileUploadingActionCreators.finishUploadingFiles(FileUploadingStore.getFileUploadingResults().SUCCESS);
      // }

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

        ApiUtils.postAssembly(assemblyData, function iife(error, data) {
          console.log('OK');
          console.dir(data);
        });
      });
    });
  }

};
