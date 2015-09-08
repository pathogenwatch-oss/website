import AppDispatcher from '../dispatcher/AppDispatcher';

module.exports = {

  setMetadataDateComponent(fileAssemblyId, component, value) {
    let valueInt = parseInt(value, 10);

    if (typeof valueInt !== 'number' || valueInt === -1 || isNaN(valueInt)) {
      valueInt = null;
    }

    AppDispatcher.dispatch({
      type: 'set_metadata_date_component',
      fileAssemblyId,
      component,
      value: valueInt,
    });
  },

  setMetadataDate: function setMetadataDate(fileAssemblyId, date) {
    AppDispatcher.dispatch({
      type: 'set_metadata_date',
      fileAssemblyId: fileAssemblyId,
      date: date
    });
  },

  setMetadataColumn: function setMetadataColumn(fileAssemblyId, columnName, value) {
    AppDispatcher.dispatch({
      type: 'set_metadata_column',
      fileAssemblyId: fileAssemblyId,
      columnName: columnName,
      value: value
    });
  },

  setMetadataSource: function setMetadataDay(fileAssemblyId, source) {
    source = parseInt(source, 10);

    if (typeof source !== 'number' || source === -1 || isNaN(source)) {
      source = null;
    }

    var setMetadataSourceAction = {
      type: 'set_metadata_source',
      fileAssemblyId: fileAssemblyId,
      source: source
    };

    AppDispatcher.dispatch(setMetadataSourceAction);
  }
};
