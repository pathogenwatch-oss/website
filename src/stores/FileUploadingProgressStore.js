import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

const CHANGE_EVENT = 'change';

let numberOfExpectedResults = null;
let numberOfReceivedResults = 0;
let fileProgress = {};
let uploadedFiles = 0;
let receivedResults = {
  assembly: {
    core: 0,
    fp: 0,
    mlst: 0,
    paarsnp: 0,
  },
  collection: {
    phylo_matrix: false,
    core_mutant_tree: false,
    submatrix: false,
  },
};

function setNumberOfExpectedResults(number) {
  numberOfExpectedResults = number;
}

function setReceivedResult(result) {
  numberOfReceivedResults++;

  const resultName = result.result.toLowerCase();
  if (result.assemblyId) {
    const numberOfResults = receivedResults.assembly[resultName] || 0;
    receivedResults.assembly[resultName] = numberOfResults + 1;

    console.log('[WGSA][Assembly Result] ' + result.assemblyId + ' ' + result.result);
    return;
  }

  receivedResults.collection[resultName] = true;

  console.log('[WGSA][Collection Result] ' + result.collectionId + ' ' + result.result);
}

function setAssemblyProgress(assemblyId, progress) {
  fileProgress[assemblyId] = progress;
  console.warn(fileProgress);
}

function setAssemblyUploaded() {
  uploadedFiles++;
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
    return Math.floor(
      this.getNumberOfReceivedResults() * 100 / this.getNumberOfExpectedResults()
    );
  },

  getResults() {
    return receivedResults;
  },

  getFileProgress() {
    return Object.keys(fileProgress).reduce((sum, id) => sum + fileProgress[id] || 0, 0);
  },

  getUploadedFiles() {
    return uploadedFiles;
  },

  clearStore() {
    numberOfExpectedResults = null;
    numberOfReceivedResults = 0;
    fileProgress = {};
    uploadedFiles = 0;
    receivedResults = {
      assembly: {
        core: 0,
        fp: 0,
        mlst: 0,
        paarsnp: 0,
      },
      collection: {
        phylo_matrix: false,
        core_mutant_tree: false,
        submatrix: false,
      },
    };
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

  case 'set_assembly_uploaded':
    setAssemblyUploaded(action.assemblyId);
    emitChange();
    break;

  default:
    // ... do nothing

  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
