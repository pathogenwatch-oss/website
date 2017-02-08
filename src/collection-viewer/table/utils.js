import { isValid, formatMonth, formatDay } from '../../utils/Date';

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
  (column, { userDefined = {} }) => userDefined[column];

export const formatColumnKeyAsLabel =
  columnkey =>
    columnkey.
      replace(/_?_autocolou?r$/, '').
      replace(/^__/, '').
      replace(/_/g, ' ').
      toUpperCase();

export function getColumnLabel(props) {
  return (
    props.getLabel ?
      props.getLabel() :
      formatColumnKeyAsLabel(props.columnKey)
  );
}
