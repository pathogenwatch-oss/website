import { getColumnLabel } from '../table/utils';
import { tableKeys } from '../constants';
import { getColourState, nonResistantColour } from '../amr-utils';

export function mapColumnsToSearchCategories(columns, tableName, matcher) {
  const categories = [];
  const columnKeys = new Set();

  for (const column of columns) {
    if (column.group) {
      const subcategories =
        mapColumnsToSearchCategories(column.columns, tableName, matcher);
      for (const category of subcategories) {
        if (columnKeys.has(category.key)) continue;
        categories.push(category);
        columnKeys.add(category.key);
      }
      continue;
    }

    const { columnKey } = column;

    if (columnKey === '__name' && tableName !== tableKeys.metadata) continue;
    if (!column.valueGetter || column.hidden) continue;
    if (columnKeys.has(columnKey)) continue;

    const label = column.displayName || getColumnLabel(column);
    if (matcher && !matcher.test(label)) continue;

    categories.push({
      label,
      tableName,
      key: columnKey,
    });
    columnKeys.add(columnKey);
  }
  return categories;
}

export function findColumn(columns, columnKey) {
  for (const column of columns) {
    if (column.columnKey === columnKey) return column;
    if (column.group) {
      const subcolumn = findColumn(column.columns, columnKey);
      if (subcolumn) return subcolumn;
    }
  }
  return null;
}

export function createSearchTerm(category, value) {
  return {
    key: `${category.key}_${value.key}`,
    category,
    value,
  };
}

export function getValueLabel(value, table) {
  if (table === tableKeys.antibiotics) {
    return getColourState(value);
  }
  if (table === tableKeys.snps || table === tableKeys.genes) {
    return value === nonResistantColour ? 'ABSENT' : 'PRESENT';
  }
  return value;
}
