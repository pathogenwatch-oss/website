import AppDispatcher from '../dispatcher/AppDispatcher';

export default {

  setMetadataDateComponent(assemblyName, component, value) {
    let valueInt = parseInt(value, 10);

    if (typeof valueInt !== 'number' || valueInt === -1 || isNaN(valueInt)) {
      valueInt = null;
    }

    AppDispatcher.dispatch({
      type: 'set_metadata_date_component',
      assemblyName,
      component,
      value: valueInt,
    });
  },

  setMetadataColumn(assemblyName, columnName, value) {
    AppDispatcher.dispatch({
      type: 'set_metadata_column',
      assemblyName: assemblyName,
      columnName: columnName,
      value: value,
    });
  },

};
