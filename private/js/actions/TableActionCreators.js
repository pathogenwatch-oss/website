var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  setAssemblyIds: function (assemblyIds) {
    var action = {
      type: 'set_table_assembly_ids',
      assemblyIds: assemblyIds
    };

    AppDispatcher.dispatch(action);
  },

  setLabelTableColumnName: function (labelTableColumnName) {
    var action = {
      type: 'set_label_table_column',
      labelTableColumnName: labelTableColumnName
    };

    AppDispatcher.dispatch(action);
  },

  setColourTableColumnName: function (colourTableColumnName) {
    var action = {
      type: 'set_colour_table_column',
      colourTableColumnName: colourTableColumnName
    };

    AppDispatcher.dispatch(action);
  }

};
