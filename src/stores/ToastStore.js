import React from 'react';
import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter }  from 'events';
import assign from 'object-assign';

import UploadStore from './UploadStore';

import { defineUploadStoreErrorToast } from '../utils/Toast';

const CHANGE_EVENT = 'change';

let toast = {
  message: (<span><strong>Please note:</strong> WGSA will be unavailable on <strong>Monday 4th April 2016</strong> as we perform essential maintenance. We apologise for any inconvenience this may cause.</span>),
};

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
