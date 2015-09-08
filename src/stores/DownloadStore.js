import { EventEmitter } from 'events';
import assign from 'object-assign';

import Api from '../utils/Api';
import AppDispatcher from '../dispatcher/AppDispatcher';

const CHANGE_EVENT = 'change';

const requestedFiles = {};

const Store = assign({}, EventEmitter.prototype, {

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getLink(id, fileType = 'fasta') {
    if (!requestedFiles[id] || !requestedFiles[id][fileType]) {
      return null;
    }
    const encodedFilename = encodeURIComponent(requestedFiles[id][fileType]);
    return `/api/download/file/${encodedFilename}`;
  },

});

function emitChange() {
  Store.emit(CHANGE_EVENT);
}

function handleAction(action) {
  switch (action.type) {

  case 'request_file':
    const { id, idType, fileType, speciesId } = action;
    const requestedFilesForId = requestedFiles[id] || {};

    // ensures map is updated on first request
    requestedFiles[id] = requestedFilesForId;

    Api.requestFile({ speciesId }, idType, fileType, function (error, fileName) {
      if (error) {
        throw error;
      }
      requestedFilesForId[fileType] = fileName;
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
