import { EventEmitter } from 'events';
import assign from 'object-assign';

import Api from '../utils/Api';
import AppDispatcher from '../dispatcher/AppDispatcher';

import UploadedCollectionStore from './UploadedCollectionStore.js';

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
    const keyToFilenameMap = requestedFiles[id][fileType];
    const key = Object.keys(keyToFilenameMap)[0];
    return `/api/download/file/${encodeURIComponent(key)}?prettyFileName=${encodeURIComponent(keyToFilenameMap[key])}`;
  },

});

function emitChange() {
  Store.emit(CHANGE_EVENT);
}

function createIdList(id) {
  const assemblies = UploadedCollectionStore.getAssemblies();
  const collectionId = UploadedCollectionStore.getCollectionId();
  return (id === collectionId) ? Object.keys(assemblies) : [ id ];
}

function handleAction(action) {
  switch (action.type) {

  case 'request_file':
    const { id, fileType, speciesId } = action;
    const requestedFilesForId = requestedFiles[id] || {};

    // ensures map is updated on first request
    requestedFiles[id] = requestedFilesForId;

    Api.requestFile(fileType, { speciesId, idList: createIdList(id) },
      function (error, keyToFilenameMap) {
        if (error) {
          throw error;
        }
        requestedFilesForId[fileType] = keyToFilenameMap;
        console.log(requestedFiles);
        emitChange();
      }
    );
    break;

  default:
    // ... do nothing
  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
