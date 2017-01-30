import { formatMonth, formatDay, isValid } from '../../utils/Date';

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

export const getUserDefinedValue =
  (column, { metadata }) => metadata.userDefined[column];
