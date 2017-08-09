const validYear = /^[0-9]{4}$/;

export function isValid({ year, month, day }) {
  if (!year || (day && !month)) return false;

  return (
    (day ? day >= 1 && day <= 31 : true) &&
    (month ? month >= 1 && month <= 12 : true) &&
    validYear.test(year)
  );
}

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
].map((text, value) => ({ text, value }));

export const formatMonth = index => months[index - 1].text;

export function formatDay(number) {
  const b = number % 10;
  const output = (~~(number % 100 / 10) === 1) ? 'th' :
    (b === 1) ? 'st' :
    (b === 2) ? 'nd' :
    (b === 3) ? 'rd' : 'th';
  return number + output;
}

export function getFormattedDateString(date) {
  if (!isValid(date)) {
    return '';
  }

  const { year, month, day } = date;

  if (year && month && day) {
    return `${formatDay(day)} ${formatMonth(month)} ${year}`;
  }

  if (year && month) {
    return `${formatMonth(month)} ${year}`;
  }

  return year;
}

import isToday from 'date-fns/is_today';
import isYesterday from 'date-fns/is_yesterday';
import format from 'date-fns/format';

export function formatDateTime(date) {
  if (isToday(date)) {
    return `Today ${format(date, 'HH:mm')}`;
  }
  if (isYesterday(date)) {
    return `Yesterday ${format(date, 'HH:mm')}`;
  }
  return format(date, 'DD MMM YYYY HH:mm');
}

export function formatDate(date) {
  return format(date, 'DD MMM YYYY');
}

import difference from 'date-fns/difference_in_calendar_months';

const referencePoint = new Date('0001-01-01T00:00:00Z');
export function dateToInteger(date) {
  return difference(date, referencePoint);
}

import addMonths from 'date-fns/add_months';

export function integerToDate(int) {
  return addMonths(referencePoint, int);
}
