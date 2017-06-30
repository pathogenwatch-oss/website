import { createSelector } from 'reselect';

import { getTables } from '../table/selectors';

import { getColumnLabel } from '../table/utils';

function mapColumnsToSearchCategories(columns) {
  let categories = [];
  for (const column of columns) {
    if (column.group) {
      categories = categories.concat(mapColumnsToSearchCategories(column.columns));
      continue;
    }

    if (column.columnKey === '__name' ||
        column.system ||
        column.hidden) continue;

    categories.push({
      id: column.columnKey,
      label: getColumnLabel(column),
    });
  }
  return categories;
}

export const getSearchCategories = createSelector(
  getTables,
  tables => Object.keys(tables).reduce((memo, name) => {
    const table = tables[name];
    memo.push({
      name,
      columns: mapColumnsToSearchCategories(table.columns, name),
    });
    return memo;
  }, [])
);
