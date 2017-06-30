import { getColumnLabel } from '../table/utils';

export function mapColumnsToSearchCategories(columns, tableName, matcher) {
  const categories = [];
  const columnKeys = new Set();

  for (const column of columns) {
    if (column.group) {
      const subcategories =
        mapColumnsToSearchCategories(column.columns, tableName, matcher);
      for (const category of subcategories) {
        if (columnKeys.has(category.columnKey)) continue;
        categories.push(category);
        columnKeys.add(category.columnKey);
      }
      continue;
    }

    const { columnKey } = column;

    if (columnKey === '__name' && tableName !== 'metadata') continue;
    if (!column.valueGetter || column.hidden) continue;
    if (columnKeys.has(columnKey)) continue;

    const label = column.displayName || getColumnLabel(column);
    if (matcher && !matcher.test(label)) continue;

    categories.push({
      label,
      tableName,
      columnKey,
    });
    columnKeys.add(columnKey);
  }
  return categories;
}
