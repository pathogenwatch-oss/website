import { EventEmitter } from 'events';
import assign from 'object-assign';

import Api from '../utils/Api';
import AppDispatcher from '../dispatcher/AppDispatcher';

const CHANGE_EVENT = 'change';

const requestedFiles = {};

const Store = assign({}, EventEmitter.prototype, {

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getLink(assemblyId, fileType = 'fasta') {
    if (!requestedFiles[assemblyId] || !requestedFiles[assemblyId][fileType]) {
      return null;
    }
    return `/api/download/file/${requestedFiles[assemblyId][fileType]}`;
  },

});

function emitChange() {
  Store.emit(CHANGE_EVENT);
}

function handleAction(action) {
  switch (action.type) {

  case 'request_file':
    const { assembly, fileType } = action;
    const assemblyId = assembly.metadata.assemblyId;
    const requestedFilesForAssembly = requestedFiles[assemblyId] || {};

    // ensures map is updated on first request
    requestedFiles[assemblyId] = requestedFilesForAssembly;

    Api.requestFile(action, function (error, fileName) {
      if (error) {
        throw error;
      }
      requestedFilesForAssembly[fileType] = fileName;
      console.log(requestedFiles);
      emitChange();
    });
    break;

  default:
    // ... do nothing
  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
