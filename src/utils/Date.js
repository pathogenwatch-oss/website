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

const validYear = /^[0-9]{4}$/;

export function isValid({ year, month, day }) {
  if (!year || (day && !month)) return false;

  return (
    (day ? day >= 1 && day <= 31 : true) &&
    (month ? month >= 1 && month <= 12 : true) &&
    validYear.test(year)
  );
}
