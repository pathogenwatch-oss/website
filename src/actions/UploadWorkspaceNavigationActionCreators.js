var AppDispatcher = require('../dispatcher/AppDispatcher');
var UploadStore = require('../stores/UploadStore');
var UploadWorkspaceNavigationStore = require('../stores/UploadWorkspaceNavigationStore');

function getPreviousAssemblyName() {
  var currentassemblyName = UploadWorkspaceNavigationStore.getAssemblyName();
  var assemblyNames = UploadStore.getAssemblyNames();
  var indexOfCurrentassemblyName = assemblyNames.indexOf(currentassemblyName);

  if (indexOfCurrentassemblyName === 0) {
    return 0;
  }

  return assemblyNames[indexOfCurrentassemblyName - 1];
}

function getNextAssemblyName() {
  var currentassemblyName = UploadWorkspaceNavigationStore.getAssemblyName();
  var assemblyNames = UploadStore.getAssemblyNames();
  var indexOfCurrentassemblyName = assemblyNames.indexOf(currentassemblyName);
  var maximumIndex = assemblyNames.length - 1;

  if (indexOfCurrentassemblyName === maximumIndex) {
    return indexOfCurrentassemblyName;
  }

  return assemblyNames[indexOfCurrentassemblyName + 1];
}

module.exports = {

  navigateToAssembly: function (assemblyName) {
    var action = {
      type: 'navigate_to_assembly',
      assemblyName: assemblyName
    };

    AppDispatcher.dispatch(action);
  },

  navigateToPreviousAssembly: function () {
    var previousassemblyName = getPreviousAssemblyName();

    var action = {
      type: 'navigate_to_assembly',
      assemblyName: previousassemblyName
    };

    AppDispatcher.dispatch(action);
  },

  navigateToNextAssembly: function () {
    var nextassemblyName = getNextAssemblyName();

    var action = {
      type: 'navigate_to_assembly',
      assemblyName: nextassemblyName
    };

    AppDispatcher.dispatch(action);
  },

  deleteAssembly: function (assemblyName) {
    var action = {
      type: 'delete_assembly',
      assemblyName: assemblyName
    };

    AppDispatcher.dispatch(action);
  },

  setViewPage: function (page) {
    var action = {
      type: 'set_view_page',
      page: page
    };

    AppDispatcher.dispatch(action);
  }

};
