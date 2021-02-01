import { setColourColumns } from '../table/actions';
import { getAMRTableName, getActiveAMRTable } from '../table/selectors';

function isDeselection(columns, activeColumns) {
  return activeColumns.size &&
    activeColumns.size === columns.length &&
    Array.from(activeColumns).every(column => columns.indexOf(column) !== -1);
}

export function onHeaderClick(event, column) {
  return (dispatch, getState) => {
    const state = getState();
    const name = getAMRTableName(state);
    const { activeColumns } = getActiveAMRTable(state);

    const columns = column.group ?
      column.columns.filter(_ => _.valueGetter && !_.hidden) :
      [ column ];
    const partiallySelected =
      column.group && columns.some(c => !activeColumns.has(c));

    const cumulative = (event.metaKey || event.ctrlKey);
    if (cumulative) {
      for (const c of columns) {
        if (column.group && partiallySelected) activeColumns.add(c);
        else activeColumns[activeColumns.has(c) ? 'delete' : 'add'](c);
      }
      dispatch(setColourColumns(name, new Set(activeColumns)));
      return;
    }

    if (isDeselection(columns, activeColumns)) {
      dispatch(setColourColumns(name, new Set()));
      return;
    }

    dispatch(setColourColumns(name, new Set(columns)));
  };
}
