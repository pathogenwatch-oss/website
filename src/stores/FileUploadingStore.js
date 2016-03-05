import { EventEmitter } from 'events';
import assign from 'object-assign';

import AppDispatcher from '../dispatcher/AppDispatcher';

import UploadStore from './UploadStore';
import { postAssembly } from '../utils/Api';
import Species from '^/species';

const CHANGE_EVENT = 'change';

export const UPLOADING = 'UPLOADING';
export const UPLOAD_COMPLETE = 'UPLOAD_COMPLETE';
export const UPLOAD_FAILED = 'UPLOAD_FAILED';

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

  hasFailed() {
    return fileUploadingState === UPLOAD_FAILED;
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

  uploadFiles(callback) {
    const assemblyNames = UploadStore.getAssemblyNames();

    let retryCount = 0;
    const uploadAssembly = (assemblyName) => {
      const assembly = UploadStore.getAssembly(assemblyName);
      const { name, fasta, metadata, metrics } = assembly;
      const urlParams = {
        collectionId: collectionId,
        assemblyId: assemblyNameToAssemblyIdMap[assemblyName],
        speciesId: Species.id,
      };
      const requestBody = {
        sequences: fasta.assembly,
        metadata: Object.assign({
          assemblyName: name,
          pmid: null,
          date: {
            year: null,
            month: null,
            day: null,
          },
          position: {
            latitude: null,
            longitude: null,
          },
        }, metadata),
        metrics,
      };

      postAssembly(urlParams, requestBody, function (error) {
        if (error) {
          console.error(error);
          if (retryCount < 3) {
            retryCount++;
            console.warn(assemblyName, `retry ${retryCount}`);
            setTimeout(() => uploadAssembly(assemblyName), 3000);
          } else {
            callback(new Error('Upload failed to complete'));
          }
          return;
        }

        retryCount = 0;
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

  case 'notify_upload_failed':
    setFileUploadingState(UPLOAD_FAILED);
    emitChange();
    break;

  default:
    // ... do nothing

  }
}

Store.dispatchToken = AppDispatcher.register(handleAction);

module.exports = Store;
