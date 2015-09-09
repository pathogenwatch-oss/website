var AppDispatcher = require('../dispatcher/AppDispatcher');
var UploadStore = require('../stores/UploadStore');
var FileUploadingProgressStore = require('../stores/FileUploadingProgressStore');
var FileUploadingStore = require('../stores/FileUploadingStore');
var FileUploadingActionCreators = require('../actions/FileUploadingActionCreators');

module.exports = {

  setNumberOfExpectedResults: function () {
    var numberOfAssembliesToUpload = UploadStore.getAssemblyNames().length;
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
    const action = {
      type: 'add_received_result',
      result: result,
    };

    AppDispatcher.dispatch(action);

    const numberOfExpectedResults = FileUploadingProgressStore.getNumberOfExpectedResults();
    const numberOfReceivedResults = FileUploadingProgressStore.getNumberOfReceivedResults();

    console.log(`Expected: ${numberOfExpectedResults}, Received: ${numberOfReceivedResults}`);

    if (numberOfExpectedResults === numberOfReceivedResults) {
      // console.log('[Macroreact] Received all results');

      FileUploadingActionCreators.finishUploadingFiles(FileUploadingStore.getFileUploadingResults().SUCCESS);
    }
  },

};
