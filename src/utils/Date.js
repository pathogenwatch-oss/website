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
];

export const formatMonth = index => months[index - 1];

export function formatDay(number) {
  const b = number % 10;
  const output = (~~(number % 100 / 10) === 1) ? 'th' :
    (b === 1) ? 'st' :
    (b === 2) ? 'nd' :
    (b === 3) ? 'rd' : 'th';
  return number + output;
}
