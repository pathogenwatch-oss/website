import AppDispatcher from '../dispatcher/AppDispatcher';

module.exports = {

  setAssemblyIds: function (assemblyIds) {
    AppDispatcher.dispatch({
      type: 'set_filtered_assembly_ids',
      assemblyIds: assemblyIds,
    });
  },

  setLabelTableColumnName: function (labelTableColumnName) {
    AppDispatcher.dispatch({
      type: 'set_label_table_column',
      labelTableColumnName: labelTableColumnName,
    });
  },

  setColourTableColumnName: function (colourTableColumnName) {
    AppDispatcher.dispatch({
      type: 'set_colour_table_column',
      colourTableColumnName: colourTableColumnName,
    });
  },

};
