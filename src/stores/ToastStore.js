import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter }  from 'events';
import assign from 'object-assign';

import UploadStore from './UploadStore';
import DownloadStore from './DownloadStore';

import { defineUploadStoreErrorToast } from '../utils/Toast';

const CHANGE_EVENT = 'change';

let toast = null;

function showToast(data) {
  toast = data;
}

function hideToast() {
  toast = null;
}

const Store = assign({}, EventEmitter.prototype, {
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getToast() {
    return toast || {};
  },
});

function emitChange() {
  Store.emit(CHANGE_EVENT);
}

function hideToastForAssembly(assemblyName) {
  if (!assemblyName) {
    return;
  }
  if (toast && toast.assemblyName && toast.assemblyName === assemblyName) {
    hideToast();
  }
}

function handleAction(action) {
  switch (action.type) {

  case 'add_files':
  case 'delete_assembly':
    AppDispatcher.waitFor([
      UploadStore.dispatchToken,
    ]);
    hideToastForAssembly(action.assemblyName);
    const errors = UploadStore.getErrors();
    if (errors.length) {
      showToast(defineUploadStoreErrorToast(errors));
    } else {
      hideToast();
    }
    emitChange();
    break;

  case 'navigate_to_assembly':
    hideToastForAssembly(action.assemblyName);
    emitChange();
    break;

  case 'request_file':
    AppDispatcher.waitFor([
      DownloadStore.dispatchToken,
    ]);
    const { format, idList } = action;
    const { error } = DownloadStore.getDownloadStatus(format, idList);
    if (error) {
      showToast({ message: 'Download failed to generate.' });
      emitChange();
    }
    break;

  case 'show_toast':
    showToast(action.toast);
    emitChange();
    break;

  case 'hide_toast':
    hideToast();
    emitChange();
    break;

  default:
    // ... do nothing

  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

export default Store;
