import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import UploadedCollectionStore from './UploadedCollectionStore.js';
import SubtreeStore from './SubtreeStore';

const CHANGE_EVENT = 'change';

let assemblyIds = null;
let labelTableColumnName = null;
let colourTableColumnName = null;

function setAssemblyIds(ids) {
  assemblyIds = ids;
}

function setLabelTableColumnName(tableColumnName) {
  if (tableColumnName === labelTableColumnName) {
    labelTableColumnName = null;
    return;
  }
  labelTableColumnName = tableColumnName;
}

function setColourTableColumnName(tableColumnName) {
  if (tableColumnName === colourTableColumnName) {
    colourTableColumnName = null;
    return;
  }
  colourTableColumnName = tableColumnName;
}

function emitChange() {
  TableStore.emit(CHANGE_EVENT);
}

var TableStore = assign({}, EventEmitter.prototype, {

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getAssemblyIds: function () {
    return assemblyIds;
  },

  getLabelTableColumnName: function () {
    return labelTableColumnName;
  },

  getColourTableColumnName: function () {
    return colourTableColumnName;
  }

});

function handleAction(action) {
  switch (action.type) {

  case 'set_table_assembly_ids':
    setAssemblyIds(action.assemblyIds);
    emitChange();
    break;

  case 'set_label_table_column':
    setLabelTableColumnName(action.labelTableColumnName);
    emitChange();
    break;

  case 'set_colour_table_column':
    setColourTableColumnName(action.colourTableColumnName);
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

  default:
    // ... do nothing

  }
}

TableStore.dispatchToken = AppDispatcher.register(handleAction);

module.exports = TableStore;
