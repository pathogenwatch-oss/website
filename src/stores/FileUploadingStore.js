import { EventEmitter } from 'events';
import assign from 'object-assign';
import keyMirror from 'keymirror';

import AppDispatcher from '../dispatcher/AppDispatcher';

import Species from '../species';

const CHANGE_EVENT = 'change';

const ASSEMBLY_PROCESSING_RESULTS = [
  'CORE',
  'FP',
  'MLST',
  'PAARSNP',
];

const COLLECTION_PROCESSING_RESULTS = keyMirror({
  PHYLO_MATRIX: null,
  CORE_MUTANT_TREE: null,
  SUBMATRIX: null,
});

const STATES = keyMirror({
  NOT_UPLOADING_FILES: null,
  UPLOADING_FILES: null,
});

const RESULTS = keyMirror({
  NONE: null,
  SUCCESS: null,
  ERROR: null,
  ABORT: null,
});

let fileUploadingState = null;
let fileUploadingResult = RESULTS.NONE;
let collectionId = null;
let assemblyNameToAssemblyIdMap = null;

function setFileUploadingState(state) {
  fileUploadingState = state;
}

function setFileUploadingResult(result) {
  fileUploadingResult = result;
}

function setCollectionId(id) {
  collectionId = id;
}

function setassemblyNameToAssemblyIdMap(idToIdMap) {
  assemblyNameToAssemblyIdMap = idToIdMap;
}

const Store = assign({}, EventEmitter.prototype, {
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getFileUploadingState: function () {
    return fileUploadingState;
  },

  getFileUploadingResult: function () {
    return fileUploadingResult;
  },

  getFileUploadingResults: function () {
    return RESULTS;
  },

  getAssemblyProcessingResults: function () {
    return ASSEMBLY_PROCESSING_RESULTS.filter(
      (result) => Species.missingAnalyses.indexOf(result) === -1
    );
  },

  getCollectionProcessingResults: function () {
    return COLLECTION_PROCESSING_RESULTS;
  },

  getCollectionId: function () {
    return collectionId;
  },

  getAssemblyNameToAssemblyIdMap: function () {
    return assemblyNameToAssemblyIdMap;
  },

  getAssemblyId(assemblyName) {
    return assemblyNameToAssemblyIdMap ?
      assemblyNameToAssemblyIdMap[assemblyName] :
      null;
  },

  clearStore: function () {
    fileUploadingState = null;
    fileUploadingResult = RESULTS.NONE;
    collectionId = null;
    assemblyNameToAssemblyIdMap = null;
  },
});

function emitChange() {
  Store.emit(CHANGE_EVENT);
}

function handleAction(action) {
  switch (action.type) {

  case 'start_uploading_files':
    setFileUploadingState(STATES.UPLOADING_FILES);
    emitChange();
    break;

  case 'finish_uploading_files':
    setFileUploadingState(null);
    setFileUploadingResult(action.result);
    emitChange();
    break;

  case 'set_collection_id':
    setCollectionId(action.collectionId);
    setassemblyNameToAssemblyIdMap(action.assemblyNameToAssemblyIdMap);
    emitChange();
    break;

  default:
    // ... do nothing

  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
