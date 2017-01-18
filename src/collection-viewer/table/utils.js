import { formatMonth, formatDay } from '../../utils/Date';

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

export const getUserDefinedValue =
  (column, { metadata }) => metadata.userDefined[column];
