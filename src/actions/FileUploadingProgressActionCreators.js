import AppDispatcher from '../dispatcher/AppDispatcher';
import UploadStore from '../stores/UploadStore';
import FileUploadingProgressStore from '../stores/FileUploadingProgressStore';
import FileUploadingStore from '../stores/FileUploadingStore';
import FileUploadingActionCreators from '../actions/FileUploadingActionCreators';

export default {

  setNumberOfExpectedResults() {
    var numberOfAssembliesToUpload = UploadStore.getAssemblyNames().length;
    var numberOfResultsPerAssembly = FileUploadingStore.getAssemblyProcessingResults().length;
    var numberOfResultsPerCollection = Object.keys(FileUploadingStore.getCollectionProcessingResults()).length;
    var numberOfExpectedResults = numberOfAssembliesToUpload * numberOfResultsPerAssembly + numberOfResultsPerCollection;

    var action = {
      type: 'set_number_of_expected_results',
      numberOfExpectedResults: numberOfExpectedResults,
    };

    AppDispatcher.dispatch(action);
  },

  setAssemblyProgress(assemblyId, progress) {
    AppDispatcher.dispatch({
      type: 'set_assembly_progress',
      assemblyId,
      progress,
    });
  },

  setAssemblyUploaded(assemblyId) {
    AppDispatcher.dispatch({
      type: 'set_assembly_uploaded',
      assemblyId,
    });
  },

  addReceivedResult(result) {
    const action = {
      type: 'add_received_result',
      result: result,
    };

    AppDispatcher.dispatch(action);

    const numberOfExpectedResults = FileUploadingProgressStore.getNumberOfExpectedResults();
    const numberOfReceivedResults = FileUploadingProgressStore.getNumberOfReceivedResults();

    // console.log(`Expected: ${numberOfExpectedResults}, Received: ${numberOfReceivedResults}`);

    if (numberOfExpectedResults === numberOfReceivedResults) {
      console.log('[WGSA] Received all results');
      // fire action on next tick to allow last result to show.
      setTimeout(() =>
        FileUploadingActionCreators.finishUploadingFiles(
          FileUploadingStore.getFileUploadingResults().SUCCESS
        ),
      0);
    }
  },

};
