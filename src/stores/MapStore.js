import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import SubtreeStore from './SubtreeStore';
import UploadedCollectionStore from './UploadedCollectionStore.js';

const CHANGE_EVENT = 'change';

let assemblyIds = null;

function emitChange() {
  MapStore.emit(CHANGE_EVENT);
}

const MapStore = assign({}, EventEmitter.prototype, {

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getAssemblyIds: function () {
    return assemblyIds;
  }

});

function handleAction(action) {
  switch (action.type) {

  case 'set_map_assembly_ids':
    assemblyIds = action.assemblyIds;
    emitChange();
    break;

  case 'set_collection':
  case 'set_active_species_subtree_id':
    AppDispatcher.waitFor([
      SubtreeStore.dispatchToken,
      UploadedCollectionStore.dispatchToken,
    ]);
    if (!this.activeSubtreeId) {
      assemblyIds = Object.keys(UploadedCollectionStore.getAssemblies());
    } else {
      assemblyIds = SubtreeStore.getActiveSubtreeAssemblyIds();
    }
    emitChange();
    break;

  default: // ... do nothing

  }
}

MapStore.dispatchToken = AppDispatcher.register(handleAction);

module.exports = MapStore;
