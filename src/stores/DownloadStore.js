import { EventEmitter } from 'events';
import assign from 'object-assign';

import Api from '../utils/Api';
import AppDispatcher from '../dispatcher/AppDispatcher';

import FilteredDataStore from './FilteredDataStore.js';
import UploadedCollectionStore from './UploadedCollectionStore.js';

const CHANGE_EVENT = 'change';

const requestedFiles = new Map();

function getIdList(format) {
  if (format === 'score_matrix' || format === 'differences_matrix') {
    return [ UploadedCollectionStore.getCollectionId() ];
  }
  return FilteredDataStore.getAssemblyIds();
}

const Store = assign({}, EventEmitter.prototype, {

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getDownloadStatus(format = 'fasta') {
    const ids = getIdList(format);
    const statuses = requestedFiles.get(ids);
    if (!statuses || !statuses[format]) {
      return null;
    }
    return statuses[format];
  },

});

function emitChange() {
  Store.emit(CHANGE_EVENT);
}

function createLink(keyToFilenameMap = {}) {
  const key = Object.keys(keyToFilenameMap)[0];
  if (!key) {
    return '';
  }
  return `/api/download/file/${encodeURIComponent(key)}?prettyFileName=${encodeURIComponent(keyToFilenameMap[key])}`;
}

function handleAction(action) {
  switch (action.type) {

  case 'request_file':
    const { format, speciesId } = action;
    const idList = getIdList(format);
    const requestedFilesForIds = requestedFiles.get(idList) || {};

    // ensures map is updated on first request
    requestedFiles.set(idList, requestedFilesForIds);
    console.log(requestedFiles);
    Api.requestFile(format, { speciesId, idList },
      function (error, keyToFilenameMap) {
        requestedFilesForIds[format] = {
          error,
          link: createLink(keyToFilenameMap),
        };
        emitChange();
      }
    );
    break;

  default:
    // ... do nothing
  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

export default Store;
