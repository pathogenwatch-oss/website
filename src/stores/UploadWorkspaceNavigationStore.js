import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter }  from 'events';
import assign from 'object-assign';
import UploadStore from './UploadStore';

const CHANGE_EVENT = 'change';

let fileAssemblyId = null;

function setFileAssemblyId(id) {
  fileAssemblyId = id;
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

  getFileAssemblyId() {
    return fileAssemblyId;
  },

  getNextFileAssemblyIdOnDelete(fileAssemblyIdForDelete) {
    const allAssemblyIds = UploadStore.getFileAssemblyIds();
    const indexOfFileAssemblyIdForDelete = allAssemblyIds.indexOf(fileAssemblyIdForDelete);
    const totalNoAssemblyIds = allAssemblyIds.length;
    let nextAssemblyIdForDisplay = null;
    // Check next index is a valid fileId for traverse
    if (allAssemblyIds.length > 0) {
      if (indexOfFileAssemblyIdForDelete + 1 < totalNoAssemblyIds) {
        nextAssemblyIdForDisplay = allAssemblyIds[indexOfFileAssemblyIdForDelete + 1];
      } else {
        nextAssemblyIdForDisplay = allAssemblyIds[indexOfFileAssemblyIdForDelete - 1];
      }
    }

    return nextAssemblyIdForDisplay;
  },

});

function handleAction(action) {
  switch (action.type) {

  case 'navigate_to_assembly':
    setFileAssemblyId(action.fileAssemblyId);
    emitChange();
    break;

  default:
    // ... do nothing

  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
