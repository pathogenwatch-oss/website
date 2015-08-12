var moment = require('moment');

function isDateWithinRange(date, startDate, endDate) {
  // It's important to include start and end dates in that range
  return (! moment(date).isBefore(startDate) && ! moment(date).isAfter(endDate));
}

function getMaximumDatePartFromData(datePart, dataObjects) {
  var dateParts = [];
  var datePartValue;

  dataObjects.forEach(function (dataObject) {
    datePartValue = dataObject['__' + datePart];
    if (! parseInt(datePartValue, 10)) {
      return;
    }
    dateParts.push(datePartValue);
  });

  if (dateParts.length === 0) {
    return null;
  }

  return Math.max.apply(Math, dateParts);
}

function getMinimumDatePartFromData(datePart, dataObjects) {
  var dateParts = [];
  var datePartValue;

  dataObjects.forEach(function (dataObject) {
    datePartValue = dataObject['__' + datePart];
    if (! parseInt(datePartValue, 10)) {
      return;
    }
    dateParts.push(datePartValue);
  });

  if (dateParts.length === 0) {
    return null;
  }

  return Math.min.apply(Math, dateParts);
}

function getMinimumDateFromData(dataObjects) {
  var minimumYear = getMinimumDatePartFromData('year', dataObjects);
  var minimumMonth = getMinimumDatePartFromData('month', dataObjects);
  var minimumDay = getMinimumDatePartFromData('day', dataObjects);

  if (! minimumYear) {
    return null;
  }

  if (! minimumMonth) {
    return new Date(minimumYear, 0, 1);
  }

  return new Date(minimumYear, minimumMonth - 1, minimumDay);
}

function getMaximumDateFromData(dataObjects) {
  var maximumYear = getMaximumDatePartFromData('year', dataObjects);
  var maximumMonth = getMaximumDatePartFromData('month', dataObjects);
  var maximumDay = getMaximumDatePartFromData('day', dataObjects);

  if (! maximumYear) {
    return null;
  }

  if (! maximumMonth) {
    return new Date(maximumYear, 0, 1);
  }

  return new Date(maximumYear, maximumMonth - 1, maximumDay);
}

function doesDataObjectHaveTimelineDate(dataObject) {
  return (getDate(dataObject) !== null);
}

function isDataObjectWithinDateRange(startDate, endDate, dataObject) {
  var date = getDate(dataObject);

  if (date && startDate && endDate) {
    if (isDateWithinRange(date, startDate, endDate)) {
      return true;
    }
  }

  return false;
}

function getDataObjectsWithinDateRange(startDate, endDate, dataObjects) {
  if (startDate && endDate) {
    return dataObjects.filter(isDataObjectWithinDateRange.bind(this, startDate, endDate));
  }

  return dataObjects;
}

function sanitizeYear(year) {
  var sanitizedYear = null;

  if (parseInt(year, 10)) {
    sanitizedYear = parseInt(year, 10);
  }

  return sanitizedYear;
}

function sanitizeMonth(month) {
  var sanitizedMonth = null;

  if (parseInt(month, 10)) {
    sanitizedMonth = parseInt(month, 10);
  }

  return sanitizedMonth;
}

function sanitizeDay(day) {
  var sanitizedDay = null;

  if (parseInt(day, 10)) {
    sanitizedDay = parseInt(day, 10);
  }

  return sanitizedDay;
}

function getDate(dataObject) {
  var year = sanitizeYear(dataObject['__year']);
  var month = sanitizeMonth(dataObject['__month']);
  var day = sanitizeDay(dataObject['__day']);
  var date;

  if (! year) {
    return null;
  }

  if (month && day) {
    date = new Date(year, month - 1, day);
  } else if (month) {
    date = new Date(year, month - 1, 1);
  } else {
    date = new Date(year, 0, 1);
  }

  return date;
}

module.exports = {
  doesDataObjectHaveTimelineDate: doesDataObjectHaveTimelineDate,
  getDate: getDate,
  sanitizeYear: sanitizeYear,
  sanitizeMonth: sanitizeMonth,
  sanitizeDay: sanitizeDay,
  getDataObjectsWithinDateRange: getDataObjectsWithinDateRange,
  isDataObjectWithinDateRange: isDataObjectWithinDateRange,
  getMinimumDateFromData: getMinimumDateFromData,
  getMaximumDateFromData: getMaximumDateFromData,
  isDateWithinRange: isDateWithinRange
};
