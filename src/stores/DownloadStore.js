import { EventEmitter } from 'events';
import assign from 'object-assign';

import Api from '../utils/Api';
import AppDispatcher from '../dispatcher/AppDispatcher';

import ToastActionCreators from '../actions/ToastActionCreators';

import FilteredDataUtils from '../utils/FilteredData';

const CHANGE_EVENT = 'change';

const requestedFiles = new Map();

const Store = assign({}, EventEmitter.prototype, {

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getDownloadStatus(format, ids = FilteredDataUtils.getDownloadIdList(format)) {
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

function createLink(keyToFilenameMap) {
  const key = Object.keys(keyToFilenameMap)[0];
  if (!key) {
    return '';
  }
  return `/api/download/file/${encodeURIComponent(key)}?` +
    `prettyFileName=${encodeURIComponent(keyToFilenameMap[key])}`;
}

function handleAction(action) {
  switch (action.type) {

  case 'request_file':
    const { format, id, speciesId } = action;
    const requestedFilesForIds = requestedFiles.get(id) || {};

    // ensures map is updated on first request
    requestedFiles.set(id, requestedFilesForIds);

    const requestBody = { speciesId, idList: typeof id === 'string' ? [ id ] : id };
    Api.requestFile(format, requestBody,
      function (error, keyToFilenameMap = {}) {
        requestedFilesForIds[format] = {
          error,
          link: createLink(keyToFilenameMap),
        };
        emitChange();
        if (error) {
          ToastActionCreators.showToast({
            message: 'Failed to generate download, please try again later.',
          });
        }
      }
    );
    break;

  default:
    // ... do nothing
  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

export default Store;
