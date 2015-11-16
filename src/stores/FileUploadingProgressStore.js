import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

const CHANGE_EVENT = 'change';

let numberOfExpectedResults = null;
const receivedResults = {};
const receivedAssemblyResults = {
  assemblies: null,
  collection: null,
};

function setNumberOfExpectedResults(number) {
  numberOfExpectedResults = number;
}

function setReceivedResult(result) {
  const resultString = result.assemblyId + '__' + result.result;

  receivedResults[resultString] = true;

  if (result.assemblyId) {
    receivedAssemblyResults.assemblies = receivedAssemblyResults.assemblies || {};
    receivedAssemblyResults.assemblies[result.assemblyId] = receivedAssemblyResults.assemblies[result.assemblyId] || {};
    receivedAssemblyResults.assemblies[result.assemblyId][result.result] = true;

    // console.log('[WGSA][Assembly Result] ' + result.assemblyId + ' ' + result.result);
    console.dir(receivedAssemblyResults);

    return;
  }

  receivedAssemblyResults.collection = receivedAssemblyResults.collection || {};
  receivedAssemblyResults.collection[result.result] = true;

  // console.log('[WGSA][Collection Result] ' + result.collectionId + ' ' + result.result);
  console.dir(receivedAssemblyResults);
}

function setAssemblyProgress(assemblyId, progress) {
  receivedAssemblyResults.assemblies = receivedAssemblyResults.assemblies || {};
  receivedAssemblyResults.assemblies[assemblyId] = receivedAssemblyResults.assemblies[assemblyId] || {};
  receivedAssemblyResults.assemblies[assemblyId].progress = Math.floor(progress);
  console.log(receivedResults);
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
    return Object.keys(receivedResults).length;
  },

  getProgressPercentage() {
    return Math.floor(this.getNumberOfReceivedResults() * 100 / this.getNumberOfExpectedResults());
  },

  getReceivedAssemblyResults() {
    return receivedAssemblyResults;
  },

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
