var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  setAssemblyIds: function (assemblyIds) {
    var action = {
      type: 'set_table_assembly_ids',
      assemblyIds: assemblyIds
    };

    AppDispatcher.dispatch(action);
  },

  setSelectedTableColumn: function (selectedTableColumn) {
    var action = {
      type: 'set_selected_table_column',
      selectedTableColumn: selectedTableColumn
    };

    AppDispatcher.dispatch(action);
  }

};
