function generateYears(startYear, endYear) {
  var years = [];
  var yearCounter = endYear;

  for (; yearCounter !== startYear - 1;) {
    years.push(yearCounter);
    yearCounter = yearCounter - 1;
  }

  return years;
}

function generateMonths() {
  var listOfMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var monthCounter = 0;

  listOfMonths = listOfMonths.map(function iife(monthName, index, array) {
    return {
      name: monthName,
      number: index + 1
    };
  });

  return listOfMonths;
}

function generateDays(year, month) {
  var days = [];

  if (typeof year !== 'number' || typeof month !== 'number') {
    return days;
  }

  var totalNumberOfDays = getTotalNumberOfDaysInMonth(year, month);
  var dayCounter = 0;

  while (dayCounter < totalNumberOfDays) {
    dayCounter = dayCounter + 1;
    days.push(dayCounter);
  }

  return days;
}

function getTotalNumberOfDaysInMonth(year, month) {
  // Date() object counts months from 0 to 11
  month = month - 1;

  // http://www.dzone.com/snippets/determining-number-days-month
  return (32 - new Date(year, month, 32).getDate());
}

function getCountry(isolate) {
  if (isolate.metadata.geography.location && isolate.metadata.geography.location.country) {
    return isolate.metadata.geography.location.country;
  }

  return '';
}

function convertDataObjectToCustomObject(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  return {
    year: year,
    month: month,
    day: day
  };
}

function fixMetadataDateFormatInCollection(collection) {
  var assemblies = collection.collection.assemblies;
  var assemblyIds = Object.keys(assemblies);
  var assembly;

  assemblyIds.forEach(function iife(assemblyId) {
    assembly = assemblies[assemblyId];

    if (assembly.metadata.datetime) {
      assembly.metadata.date = convertDataObjectToCustomObject(new Date(assembly.metadata.datetime));
    }

    assemblies[assemblyId] = assembly;
  });

  collection.assemblies = assemblies;

  return collection;
}

function validateMetadata(collection) {
  var isValidMap = {};
  for (var id in collection) {
    console.log(collection[id])
    if (!collection[id].fasta.assembly ||
        !collection[id].metadata.date.year ||
        !collection[id].metadata.geography.position.longitude ||
        !collection[id].metadata.geography.position.latitude
      ) {
      isValidMap[id] = false;
    }
    else {
      isValidMap[id] = true;
    }
  }
  // console.log(assemblies);
  return isValidMap;
}

module.exports = {
  generateYears: generateYears,
  generateMonths: generateMonths,
  generateDays: generateDays,
  getTotalNumberOfDaysInMonth: getTotalNumberOfDaysInMonth,
  getCountry: getCountry,
  fixMetadataDateFormatInCollection: fixMetadataDateFormatInCollection,
  validateMetadata: validateMetadata
};

