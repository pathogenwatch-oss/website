import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter }  from 'events';
import assign from 'object-assign';
import UploadStore from './UploadStore';

const CHANGE_EVENT = 'change';

let toast = {
  data: null,
  active: false
};

function showToast(data) {
  toast.data = data;
  toast.active = true;
}

function hideToast() {
  toast.data = {};
  toast.active = false;
}

function emitChange() {
  Store.emit(CHANGE_EVENT);
}

const Store = assign({}, EventEmitter.prototype, {
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  toastActive() {
    return toast.active;
  },

  getToastData() {
    return toast;
  }
});

function handleAction(action) {
  switch (action.type) {

  case 'add_files':
    AppDispatcher.waitFor([
      UploadStore.dispatchToken,
    ]);
    var errors = UploadStore.hasError();
    console.log(errors)
    if (errors.length) {
      showToast({ message: errors[0].message, sticky: true });
      emitChange();
    }
    break;

  case 'show_toast':
    showToast({ message: 'Hello world', sticky: true });
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

module.exports = Store;
