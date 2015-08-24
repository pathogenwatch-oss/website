var AppDispatcher = require('../dispatcher/AppDispatcher');
var UploadStore = require('../stores/UploadStore');
var FileUploadingProgressStore = require('../stores/FileUploadingProgressStore');
var FileUploadingStore = require('../stores/FileUploadingStore');
var FileUploadingActionCreators = require('../actions/FileUploadingActionCreators');

module.exports = {

  setNumberOfExpectedResults: function () {
    var numberOfAssembliesToUpload = UploadStore.getFileAssemblyIds().length;
    var numberOfResultsPerAssembly = Object.keys(FileUploadingStore.getAssemblyProcessingResults()).length;
    var numberOfResultsPerCollection = Object.keys(FileUploadingStore.getCollectionProcessingResults()).length;
    var numberOfExpectedResults = numberOfAssembliesToUpload * numberOfResultsPerAssembly + numberOfResultsPerCollection;

    var action = {
      type: 'set_number_of_expected_results',
      numberOfExpectedResults: numberOfExpectedResults
    };

    AppDispatcher.dispatch(action);
  },

  addReceivedResult: function (result) {
    var action = {
      type: 'add_received_result',
      result: result
    };

    AppDispatcher.dispatch(action);

    var numberOfExpectedResults = FileUploadingProgressStore.getNumberOfExpectedResults();
    var numberOfReceivedResults = FileUploadingProgressStore.getNumberOfReceivedResults();

    if (numberOfExpectedResults === numberOfReceivedResults) {
      // console.log('[Macroreact] Received all results');

      //FileUploadingActionCreators.finishUploadingFiles(FileUploadingStore.getFileUploadingResults().SUCCESS);

      setTimeout(function () {
        FileUploadingActionCreators.finishUploadingFiles(FileUploadingStore.getFileUploadingResults().SUCCESS);
      }, 1000);
    }
  }
};
