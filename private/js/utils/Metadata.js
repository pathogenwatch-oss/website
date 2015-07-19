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
      number: index
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
  // http://www.dzone.com/snippets/determining-number-days-month
  return (32 - new Date(year, month, 32).getDate());
}

module.exports = {
  generateYears: generateYears,
  generateMonths: generateMonths,
  generateDays: generateDays,
  getTotalNumberOfDaysInMonth: getTotalNumberOfDaysInMonth
};
