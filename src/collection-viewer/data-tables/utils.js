import { setLabelColumn } from '../table/actions';
import { getTables, getVisibleTableName } from '../table/selectors';
import { formatMonth, formatDay } from '../../utils/Date';
import { nameColumnProps } from '../table/constants';

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

export const initialActiveColumn = nameColumnProps;

export function onHeaderClick(event, column) {
  return (dispatch, getState) => {
    const state = getState();
    const visibleTable = getVisibleTableName(state);
    const { activeColumn } = getTables(state)[visibleTable];

    dispatch(setLabelColumn(
      activeColumn === column ? initialActiveColumn : column,
      visibleTable
    ));
  };
}
