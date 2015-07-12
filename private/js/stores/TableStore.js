var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var SpeciesSubtreeStore = require('./SpeciesSubtreeStore');

var CHANGE_EVENT = 'change';

var assemblyIds = null;
var selectedTableColumn = 'Assembly Id';

function setAssemblyIds(ids) {
  assemblyIds = ids;
}

function setSelectedTableColumn(tableColumn) {
  selectedTableColumn = tableColumn;
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

  getSelectedTableColumn: function () {
    return selectedTableColumn;
  }

});

function handleAction(action) {

  switch (action.type) {

    case 'set_table_assembly_ids':
      setAssemblyIds(action.assemblyIds);
      emitChange();
      break;

    case 'set_selected_table_column':
      setSelectedTableColumn(action.selectedTableColumn);
      emitChange();
      break;

    case 'set_active_species_subtree_id':
      AppDispatcher.waitFor([SpeciesSubtreeStore.dispatchToken]);
      setAssemblyIds(SpeciesSubtreeStore.getActiveSpeciesSubtreeAssemblyIds());
      emitChange();
      break;

    default: // ... do nothing

  }
}

TableStore.dispatchToken = AppDispatcher.register(handleAction);

module.exports = TableStore;
