import AppDispatcher from '../dispatcher/AppDispatcher';

module.exports = {

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

  setMetadataDate: function setMetadataDate(assemblyName, date) {
    AppDispatcher.dispatch({
      type: 'set_metadata_date',
      assemblyName: assemblyName,
      date: date
    });
  },

  setMetadataColumn: function setMetadataColumn(assemblyName, columnName, value) {
    AppDispatcher.dispatch({
      type: 'set_metadata_column',
      assemblyName: assemblyName,
      columnName: columnName,
      value: value
    });
  },

  setMetadataSource: function setMetadataDay(assemblyName, source) {
    source = parseInt(source, 10);

    if (typeof source !== 'number' || source === -1 || isNaN(source)) {
      source = null;
    }

    var setMetadataSourceAction = {
      type: 'set_metadata_source',
      assemblyName: assemblyName,
      source: source
    };

    AppDispatcher.dispatch(setMetadataSourceAction);
  }
};
