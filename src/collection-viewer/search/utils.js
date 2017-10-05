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

    if (columnKey === '__name') continue;
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

export function getNameCategory(tableName, matcher) {
  const label = 'NAME';
  if (matcher && !matcher.test(label)) return null;
  return {
    tableName,
    label,
    key: '__name',
  };
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

const flags = 'i';
export function getTextMatcher(text, isExact = false) {
  const cleanText = text.replace('?', '\\?');
  if (isExact) {
    return new RegExp(`^${cleanText}$`, flags);
  }
  return new RegExp(cleanText, flags);
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
  if (isNaN(number)) return null;
  if (!number.length) return { test: () => true }; // wait for number

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

export function createBasicSearchTerm(tableName, table, genomes, text, exact) {
  const column = table.activeColumn;
  const category = {
    tableName,
    label: column.displayName || getColumnLabel(column),
    key: column.columnKey,
    numeric: column.numeric,
  };
  const ids = [];
  let matcher;
  if (column.numeric) matcher = getExpressionMatcher(text);
  if (!matcher) matcher = getTextMatcher(text, exact);
  for (const genome of genomes) {
    const value = column.valueGetter(genome);
    if (matcher && matcher.test(value)) {
      ids.push(genome.uuid);
    }
  }
  const item = { key: exact ? text : 'contains', label: text, ids };
  return createSearchTerm(category, item);
}

export function doesNotIntersect(category, terms) {
  return terms.some(term =>
    !term.value.isExpression && term.category.key === category.key
  );
}
