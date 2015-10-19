import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter }  from 'events';
import assign from 'object-assign';
import UploadStore from './UploadStore';

const CHANGE_EVENT = 'change';

let assemblyName = null;
let viewPage = null;

function setassemblyName(id) {
  assemblyName = id;
}

function setViewPage(page) {
  viewPage = page;
}

function navigateToAssembly(name) {
  setassemblyName(name);
  setViewPage(name ? 'assembly' : 'overview');
}

const Store = assign({}, EventEmitter.prototype, {
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getCurrentViewPage() {
    return viewPage;
  },

  getAssemblyName() {
    return assemblyName;
  },

});

function emitChange() {
  Store.emit(CHANGE_EVENT);
}

function handleAction(action) {
  switch (action.type) {

  case 'navigate_to_assembly':
    navigateToAssembly(action.assemblyName);
    emitChange();
    break;

  case 'set_view_page':
    setViewPage(action.page);
    emitChange();
    break;

  case 'delete_assembly':
    if (assemblyName === action.assemblyName) {
      navigateToAssembly(null);
      emitChange();
    }
    break;

  default:
    // ... do nothing

  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
