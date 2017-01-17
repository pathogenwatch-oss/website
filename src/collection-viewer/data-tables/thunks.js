import { setLabelColumn } from '../table/actions';
import { getTables, getVisibleTableName } from '../table/selectors';
import { nameColumnProps } from '../table/constants';

export function onHeaderClick(event, column) {
  return (dispatch, getState) => {
    const state = getState();
    const visibleTable = getVisibleTableName(state);
    const { activeColumn } = getTables(state)[visibleTable];

    dispatch(setLabelColumn(
      visibleTable,
      activeColumn === column ? nameColumnProps : column,
    ));
  };
}
