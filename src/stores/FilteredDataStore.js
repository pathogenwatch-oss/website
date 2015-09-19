import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import UploadedCollectionStore from './UploadedCollectionStore.js';
import SubtreeStore from './SubtreeStore';

const CHANGE_EVENT = 'change';

function defaultLabelGetter(assembly) {
  return assembly.metadata.assemblyName;
}

let assemblyIds = null;
let userDefinedColumns = [];
let labelGetter = defaultLabelGetter;
let colourTableColumnName = null;

function setAssemblyIds(ids) {
  assemblyIds = ids;
}

function setUserDefinedColumns() {
  const { userDefined } = UploadedCollectionStore.getAssemblies()[assemblyIds[0]].metadata;
  userDefinedColumns = userDefined ? Object.keys(userDefined) : [];
}

function setLabelGetter(labelGetterFn) {
  if (!labelGetterFn || labelGetterFn === labelGetter) {
    labelGetter = defaultLabelGetter;
    return;
  }
  labelGetter = labelGetterFn;
}

function setColourTableColumnName(tableColumnName) {
  if (tableColumnName === colourTableColumnName) {
    colourTableColumnName = null;
    return;
  }
  colourTableColumnName = tableColumnName;
}

const FilteredDataStore = assign({}, EventEmitter.prototype, {

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getAssemblyIds() {
    return assemblyIds;
  },

  getUserDefinedColumns() {
    return userDefinedColumns;
  },

  getLabelGetter() {
    return labelGetter;
  },

  getColourTableColumnName() {
    return colourTableColumnName;
  },

});

function emitChange() {
  FilteredDataStore.emit(CHANGE_EVENT);
}

function handleAction(action) {
  switch (action.type) {

  case 'set_filtered_assembly_ids':
    setAssemblyIds(action.assemblyIds);
    emitChange();
    break;

  case 'set_label_getter':
    setLabelGetter(action.labelGetter);
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
    setUserDefinedColumns();
    emitChange();
    break;

  default:
    // ... do nothing

  }
}

FilteredDataStore.dispatchToken = AppDispatcher.register(handleAction);

module.exports = FilteredDataStore;
