import AppDispatcher from '../dispatcher/AppDispatcher';

module.exports = {

  setAssemblyIds(assemblyIds) {
    AppDispatcher.dispatch({
      type: 'set_filtered_assembly_ids',
      assemblyIds,
    });
  },

  clearAssemblyFilter() {
    AppDispatcher.dispatch({
      type: 'clear_assembly_filter',
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

  setBaseAssemblyIds(assemblyIds) {
    AppDispatcher.dispatch({
      type: 'set_base_assembly_ids',
      assemblyIds,
    });
  },

  setTextFilter(text) {
    AppDispatcher.dispatch({
      type: 'set_text_filter',
      text,
    });
  },

};
