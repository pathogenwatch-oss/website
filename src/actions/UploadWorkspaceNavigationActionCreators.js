var AppDispatcher = require('../dispatcher/AppDispatcher');
var UploadStore = require('../stores/UploadStore');
var UploadWorkspaceNavigationStore = require('../stores/UploadWorkspaceNavigationStore');

function getPreviousFileAssemblyId() {
  var currentFileAssemblyId = UploadWorkspaceNavigationStore.getFileAssemblyId();
  var fileAssemblyIds = UploadStore.getFileAssemblyIds();
  var indexOfCurrentFileAssemblyId = fileAssemblyIds.indexOf(currentFileAssemblyId);

  if (indexOfCurrentFileAssemblyId === 0) {
    return 0;
  }

  return fileAssemblyIds[indexOfCurrentFileAssemblyId - 1];
}

function getNextFileAssemblyId() {
  var currentFileAssemblyId = UploadWorkspaceNavigationStore.getFileAssemblyId();
  var fileAssemblyIds = UploadStore.getFileAssemblyIds();
  var indexOfCurrentFileAssemblyId = fileAssemblyIds.indexOf(currentFileAssemblyId);
  var maximumIndex = fileAssemblyIds.length - 1;

  if (indexOfCurrentFileAssemblyId === maximumIndex) {
    return indexOfCurrentFileAssemblyId;
  }

  return fileAssemblyIds[indexOfCurrentFileAssemblyId + 1];
}

module.exports = {

  navigateToAssembly: function (fileAssemblyId) {
    var action = {
      type: 'navigate_to_assembly',
      fileAssemblyId: fileAssemblyId
    };

    AppDispatcher.dispatch(action);
  },

  navigateToPreviousAssembly: function () {
    var previousFileAssemblyId = getPreviousFileAssemblyId();

    var action = {
      type: 'navigate_to_assembly',
      fileAssemblyId: previousFileAssemblyId
    };

    AppDispatcher.dispatch(action);
  },

  navigateToNextAssembly: function () {
    var nextFileAssemblyId = getNextFileAssemblyId();

    var action = {
      type: 'navigate_to_assembly',
      fileAssemblyId: nextFileAssemblyId
    };

    AppDispatcher.dispatch(action);
  },

};
