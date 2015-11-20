import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

const CHANGE_EVENT = 'change';

let numberOfExpectedResults = null;
let numberOfReceivedResults = 0;
const receivedResults = {
  assemblies: null,
  collection: null,
};

function setNumberOfExpectedResults(number) {
  numberOfExpectedResults = number;
}

function setReceivedResult(result) {

  numberOfReceivedResults++;

  if (result.assemblyId) {
    receivedResults.assemblies = receivedResults.assemblies || {};
    receivedResults.assemblies[result.assemblyId] = receivedResults.assemblies[result.assemblyId] || {};
    receivedResults.assemblies[result.assemblyId][result.result] = true;

    console.log('[WGSA][Assembly Result] ' + result.assemblyId + ' ' + result.result);
    console.dir(receivedResults);

    return;
  }

  receivedResults.collection = receivedResults.collection || {};
  receivedResults.collection[result.result] = true;

  console.log('[WGSA][Collection Result] ' + result.collectionId + ' ' + result.result);
  console.dir(receivedResults);
}

function setAssemblyProgress(assemblyId, progress) {
  receivedResults.assemblies = receivedResults.assemblies || {};
  receivedResults.assemblies[assemblyId] = receivedResults.assemblies[assemblyId] || {};
  receivedResults.assemblies[assemblyId].progress = Math.floor(progress);
  console.log(numberOfReceivedResults);
}

const Store = assign({}, EventEmitter.prototype, {

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getNumberOfExpectedResults() {
    return numberOfExpectedResults;
  },

  getNumberOfReceivedResults() {
    return numberOfReceivedResults;
  },

  getProgressPercentage() {
    return Math.floor(this.getNumberOfReceivedResults() * 100 / this.getNumberOfExpectedResults());
  },

  getReceivedResults() {
    return receivedResults;
  },

  clearStore() {
    numberOfExpectedResults = null;
    numberOfReceivedResults = 0;
    receivedResults.assemblies = null;
    receivedResults.collection = null;
  }

});

function emitChange() {
  Store.emit(CHANGE_EVENT);
}

function handleAction(action) {
  switch (action.type) {

  case 'set_number_of_expected_results':
    setNumberOfExpectedResults(action.numberOfExpectedResults);
    emitChange();
    break;

  case 'set_assembly_progress':
    setAssemblyProgress(action.assemblyId, action.progress);
    emitChange();
    break;

  case 'add_received_result':
    setReceivedResult(action.result);
    emitChange();
    break;

  default:
    // ... do nothing

  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
