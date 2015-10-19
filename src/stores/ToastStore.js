import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter }  from 'events';
import assign from 'object-assign';

import UploadStore from './UploadStore';

import UploadWorkspaceNavigationActionCreators from '../actions/UploadWorkspaceNavigationActionCreators';

const CHANGE_EVENT = 'change';

let toast = null;

function showToast(data) {
  toast = data;
}

function hideToast() {
  toast = null;
}

function showUploadErrors() {
  const errors = UploadStore.getErrors();
  if (errors.length) {
    const [ { message, assemblyName, navigate } ] = errors;
    const actionDef = navigate ? {
      label: 'review',
      onClick: UploadWorkspaceNavigationActionCreators.navigateToAssembly.bind(null, assemblyName),
    } : null;
    showToast({ message, assemblyName, action: actionDef });
  } else {
    hideToast();
  }
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

function handleAction(action) {
  switch (action.type) {

  case 'add_files':
    AppDispatcher.waitFor([
      UploadStore.dispatchToken,
    ]);
    showUploadErrors(action);
    emitChange();
    break;

  case 'delete_assembly':
    AppDispatcher.waitFor([
      UploadStore.dispatchToken,
    ]);
    if (toast && toast.assemblyName && action.assemblyName === toast.assemblyName) {
      hideToast();
    }
    showUploadErrors(action);
    emitChange();
    break;

  case 'navigate_to_assembly':
    if (toast && toast.assemblyName && action.assemblyName === toast.assemblyName) {
      hideToast();
    }
    emitChange();
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
