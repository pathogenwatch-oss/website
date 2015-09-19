import AppDispatcher from '../dispatcher/AppDispatcher';

module.exports = {

  setAssemblyIds(assemblyIds) {
    AppDispatcher.dispatch({
      type: 'set_filtered_assembly_ids',
      assemblyIds,
    });
  },

  setLabelGetter(labelGetter) {
    AppDispatcher.dispatch({
      type: 'set_label_getter',
      labelGetter,
    });
  },

  setColourTableColumnName(colourTableColumnName) {
    AppDispatcher.dispatch({
      type: 'set_colour_table_column',
      colourTableColumnName,
    });
  },

};
