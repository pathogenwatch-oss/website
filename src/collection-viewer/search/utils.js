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
      numeric: column.numeric,
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
  return String(value);
}

const comparators = {
  '=': (a, b) => a === b,
  '>': (b, a) => a > b,
  '>=': (b, a) => a >= b,
  '<': (b, a) => a < b,
  '<=': (b, a) => a <= b,
};

export function getExpressionMatcher(text) {
  const cleanText = text.replace(' ', '');
  let operator;

  if (cleanText[0] === '<' || cleanText[0] === '>') {
    operator = cleanText[0];
    if (cleanText[1] === '=') {
      operator += '=';
    }
  } else if (cleanText[0] === '=') {
    operator = '=';
  }

  if (!operator) return null;

  const number = cleanText.slice(operator.length);
  if (!number.length || isNaN(number)) return null;
  const test = comparators[operator].bind(null, Number(number));
  return {
    test: value => test(Number(value)),
  };
}

export const sortFns = {
  FREQ_DESC: (a, b) => b.ids.length - a.ids.length,
  FREQ_ASC: (a, b) => a.ids.length - b.ids.length,
  VALUE_DESC: (a, b) => {
    if (a.label > b.label) return -1;
    if (a.label < b.label) return 1;
    return 0;
  },
  VALUE_ASC: (a, b) => {
    if (a.label > b.label) return 1;
    if (a.label < b.label) return -1;
    return 0;
  },
};
