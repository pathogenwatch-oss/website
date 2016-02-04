import { EventEmitter } from 'events';
import assign from 'object-assign';

import AppDispatcher from '../dispatcher/AppDispatcher';

import UploadStore from './UploadStore';
import { postAssembly } from '../utils/Api';
import Species from '^/species';

const CHANGE_EVENT = 'change';

export const UPLOADING = 'UPLOADING';
export const UPLOAD_COMPLETE = 'UPLOAD_COMPLETE';

let fileUploadingState = null;
let collectionId = null;
let assemblyNameToAssemblyIdMap = null;

function setFileUploadingState(state) {
  fileUploadingState = state;
}
function setCollectionId(id) {
  collectionId = id;
}

function setAssemblyNameToAssemblyIdMap(idToIdMap) {
  assemblyNameToAssemblyIdMap = idToIdMap;
}

const Store = assign({}, EventEmitter.prototype, {
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  isUploading() {
    return fileUploadingState === UPLOADING;
  },

  getCollectionId() {
    return collectionId;
  },

  getAssemblyNameToAssemblyIdMap() {
    return assemblyNameToAssemblyIdMap;
  },

  getAssemblyId(assemblyName) {
    return assemblyNameToAssemblyIdMap ?
      assemblyNameToAssemblyIdMap[assemblyName] :
      null;
  },

  uploadFiles() {
    console.log('*** UPLOADING FILES ***');
    const assemblyNames = UploadStore.getAssemblyNames();
    const uploadAssembly = (assemblyName) => {
      const { metadata, metrics, fasta } = UploadStore.getAssembly(assemblyName);
      const urlParams = {
        collectionId: collectionId,
        assemblyId: assemblyNameToAssemblyIdMap[assemblyName],
        speciesId: Species.id,
      };
      const requestBody = {
        sequences: fasta.assembly,
        metadata,
        metrics,
      };

      postAssembly(urlParams, requestBody, function (assemblyError) {
        if (assemblyError) {
          // TODO: Pass error to front end
          console.error(assemblyError);
          return;
        }
        if (assemblyNames.length) {
          uploadAssembly(assemblyNames.shift());
        }
      });
    };

    for (let i = 0; i < Math.min(assemblyNames.length, 10); i++) {
      uploadAssembly(assemblyNames.shift());
    }
  },

  clearStore() {
    fileUploadingState = null;
    collectionId = null;
    assemblyNameToAssemblyIdMap = null;
    UploadStore.clearStore();
  },
});

function emitChange() {
  Store.emit(CHANGE_EVENT);
}

function handleAction(action) {
  switch (action.type) {

  case 'set_collection_ids':
    setFileUploadingState(UPLOADING);
    setCollectionId(action.collectionId);
    setAssemblyNameToAssemblyIdMap(action.assemblyNameToAssemblyIdMap);
    emitChange();
    break;

  default:
    // ... do nothing

  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
