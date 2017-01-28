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

export function getFormattedDateString({ year, month, day }) {
  if (year && !month && !day) {
    return year;
  }

  if (year && month && !day) {
    return `${formatMonth(month)} ${year}`;
  }

  if (year && month && day) {
    return `${formatDay(day)} ${formatMonth(month)} ${year}`;
  }

  return '';
}
