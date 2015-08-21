var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  setMetadataYear: function setMetadataYear(fileAssemblyId, year) {
    year = parseInt(year, 10);

    if (typeof year !== 'number' || year === -1 || isNaN(year)) {
      year = null;
    }

    var setMetadataYearAction = {
      type: 'set_metadata_year',
      fileAssemblyId: fileAssemblyId,
      year: year
    };

    AppDispatcher.dispatch(setMetadataYearAction);
  },

  setMetadataMonth: function setMetadataMonth(fileAssemblyId, month) {
    month = parseInt(month, 10);

    if (typeof month !== 'number' || month === -1 || isNaN(month)) {
      month = null;
    }

    var setMetadataMonthAction = {
      type: 'set_metadata_month',
      fileAssemblyId: fileAssemblyId,
      month: month
    };

    AppDispatcher.dispatch(setMetadataMonthAction);
  },

  setMetadataDay: function setMetadataDay(fileAssemblyId, day) {
    day = parseInt(day, 10);

    if (typeof day !== 'number' || day === -1 || isNaN(day)) {
      day = null;
    }

    var setMetadataDayAction = {
      type: 'set_metadata_day',
      fileAssemblyId: fileAssemblyId,
      day: day
    };

    AppDispatcher.dispatch(setMetadataDayAction);
  },

  setMetadataDate: function setMetadataDate(fileAssemblyId, date) {
    AppDispatcher.dispatch({
      type: 'set_metadata_date',
      fileAssemblyId: fileAssemblyId,
      date: date
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
