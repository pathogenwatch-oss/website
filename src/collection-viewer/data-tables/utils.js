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

// TODO: Might be good if `date` and `userDefined` were null
export function hasMetadata([ { assemblies } ]) {
  return (
    Object.keys(assemblies).
      some(key => {
        const { metadata: { date, userDefined } } = assemblies[key];
        return !!(date.year || Object.keys(userDefined).length);
      })
  );
}
