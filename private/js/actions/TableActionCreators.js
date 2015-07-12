var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  setAssemblyIds: function (assemblyIds) {
    var action = {
      type: 'set_table_assembly_ids',
      assemblyIds: assemblyIds
    };

    AppDispatcher.dispatch(action);
  },

  setSelectedTableColumnName: function (selectedTableColumnName) {
    var action = {
      type: 'set_selected_table_column',
      selectedTableColumnName: selectedTableColumnName
    };

    AppDispatcher.dispatch(action);
  }

};
