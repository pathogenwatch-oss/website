import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

const CHANGE_EVENT = 'change';

let fileProgress = {};

function setAssemblyProgress(assemblyId, progress) {
  fileProgress[assemblyId] = progress;
}

const Store = assign({}, EventEmitter.prototype, {

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getFileProgress() {
    return Object.keys(fileProgress).reduce((sum, id) => sum + fileProgress[id] || 0, 0);
  },

  clearStore() {
    fileProgress = {};
  },

});

function emitChange() {
  Store.emit(CHANGE_EVENT);
}

function handleAction(action) {
  switch (action.type) {

  case 'set_assembly_progress':
    setAssemblyProgress(action.assemblyId, action.progress);
    emitChange();
    break;

  default:
    // ... do nothing

  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
