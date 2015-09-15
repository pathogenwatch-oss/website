import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

const CHANGE_EVENT = 'change';

let antibiotics = {};

const AntibioticsStore = assign({}, EventEmitter.prototype, {

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  get() {
    return antibiotics;
  },

});

function emitChange() {
  AntibioticsStore.emit(CHANGE_EVENT);
}

function handleAction(action) {
  switch (action.type) {

  case 'set_antibiotics':
    antibiotics = action.antibiotics;
    emitChange();
    break;

  default:
    // ... do nothing

  }
}

AntibioticsStore.dispatchToken = AppDispatcher.register(handleAction);

export default AntibioticsStore;
