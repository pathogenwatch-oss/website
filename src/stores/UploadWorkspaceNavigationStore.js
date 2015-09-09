import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter }  from 'events';
import assign from 'object-assign';
import UploadStore from './UploadStore';

const CHANGE_EVENT = 'change';

let assemblyName = null;

function setassemblyName(id) {
  assemblyName = id;
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

  getAssemblyName() {
    return assemblyName;
  },

  getNextAssemblyNameOnDelete(assemblyNameForDelete) {
    const allAssemblyIds = UploadStore.getAssemblyNames();
    const indexOfassemblyNameForDelete = allAssemblyIds.indexOf(assemblyNameForDelete);
    const totalNoAssemblyIds = allAssemblyIds.length;
    let nextAssemblyIdForDisplay = null;
    // Check next index is a valid fileId for traverse
    if (allAssemblyIds.length > 0) {
      if (indexOfassemblyNameForDelete + 1 < totalNoAssemblyIds) {
        nextAssemblyIdForDisplay = allAssemblyIds[indexOfassemblyNameForDelete + 1];
      } else {
        nextAssemblyIdForDisplay = allAssemblyIds[indexOfassemblyNameForDelete - 1];
      }
    }

    return nextAssemblyIdForDisplay;
  },

});

function handleAction(action) {
  switch (action.type) {

  case 'navigate_to_assembly':
    setassemblyName(action.assemblyName);
    emitChange();
    break;

  default:
    // ... do nothing

  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
