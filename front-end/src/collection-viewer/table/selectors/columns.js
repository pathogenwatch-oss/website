import { createSelector } from 'reselect';

import { getCollection } from '../../selectors';
import { getActiveGenomes } from '../../selectors/active';
import { getVisibleTable, getActiveColumns } from '../selectors';

import { addColumnWidth } from '../columnWidth';

function mapStateToColumn(column, state) {
  column.isSelected = state.activeColumns.has(column);
  if (column.group) {
    for (let i = 0; i < column.columns.length; i++) {
      column.columns[i] = mapStateToColumn(column.columns[i], state);
    }
    return column;
  }
  if (column.addState) return column.addState(state);
  return state.genomes.length ? addColumnWidth(column, state) : column;
}

export const getVisibleTableColumns = createSelector(
  state => getVisibleTable(state).columns,
  getActiveGenomes,
  getCollection,
  getActiveColumns,
  (columns, genomes, collection, activeColumns) =>
    columns.map(c => mapStateToColumn(c, { genomes, collection, activeColumns }))
);
