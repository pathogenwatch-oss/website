import { createSelector } from 'reselect';

import { getTables } from '../table/selectors';

import { getColumnLabel } from '../table/utils';

function mapColumnsToSearchCategories(columns, table) {
  let categories = [];
  for (const column of columns) {
    if (column.group) {
      categories = categories.concat(mapColumnsToSearchCategories(column.columns, table));
      continue;
    }

    if (column.columnKey === '__name' ||
        column.system ||
        column.hidden) continue;

    categories.push({
      id: column.columnKey,
      label: getColumnLabel(column),
      table,
    });
  }
  return categories;
}

export const getSearchCategories = createSelector(
  getTables,
  tables => Object.keys(tables).reduce((memo, key) => {
    const table = tables[key];
    return memo.concat(mapColumnsToSearchCategories(table.columns, key));
  }, [ { id: '__name', label: 'NAME' } ])
);
