import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import UploadedCollectionStore from './UploadedCollectionStore.js';
import SubtreeStore from './SubtreeStore';

const CHANGE_EVENT = 'change';

function defaultLabelGetter(assembly) {
  return assembly.metadata.assemblyName;
}

let unfilteredAssemblyIds = null;
let assemblyIds = null;
let userDefinedColumns = [];
let labelGetter = defaultLabelGetter;
let colourTableColumnName = null;

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
    const newAssemblyIds =
      action.assemblyIds.length ?
        action.assemblyIds :
        unfilteredAssemblyIds;

    if (newAssemblyIds !== assemblyIds) {
      assemblyIds = newAssemblyIds;
      emitChange();
    }
    break;

  case 'clear_assembly_filter':
    if (unfilteredAssemblyIds !== assemblyIds) {
      assemblyIds = unfilteredAssemblyIds;
      emitChange();
    }
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
    AppDispatcher.waitFor([
      UploadedCollectionStore.dispatchToken,
    ]);
    unfilteredAssemblyIds = UploadedCollectionStore.getAssemblyIds();
    assemblyIds = unfilteredAssemblyIds;
    setUserDefinedColumns();
    emitChange();
    break;

  case 'set_active_species_subtree_id':
    AppDispatcher.waitFor([
      SubtreeStore.dispatchToken,
    ]);

    unfilteredAssemblyIds = action.activeSubtreeId ?
      SubtreeStore.getActiveSubtreeAssemblyIds() :
      UploadedCollectionStore.getAssemblyIds();
    assemblyIds = unfilteredAssemblyIds;
    emitChange();
    break;

  case 'set_base_assembly_ids':
    if (unfilteredAssemblyIds !== action.assemblyIds) {
      unfilteredAssemblyIds = action.assemblyIds;
      assemblyIds = unfilteredAssemblyIds;
      emitChange();
    }
    break;

  default:
    // ... do nothing

  }
}

FilteredDataStore.dispatchToken = AppDispatcher.register(handleAction);

module.exports = FilteredDataStore;
