import { createSelector } from 'reselect';

import { getViewer, getActiveGenomes } from '../selectors';
import { getTables } from '../table/selectors';

import { mapColumnsToSearchCategories, findColumn } from './utils';

export const getSearch = state => getViewer(state).search;

export const getSearchText = state => getSearch(state).text;
export const getSearchTextMatcher = createSelector(
  getSearchText,
  text => (text.length ? new RegExp(text, 'i') : null)
);

export const getSelectedCategory = state => getSearch(state).category;
export const getDropdownVisibility = state => getSearch(state).visible;

const getTableColumns = createSelector(
  getTables,
  getSearchTextMatcher,
  (tables, matcher) => Object.keys(tables).reduce((memo, name) => {
    const table = tables[name];
    const items = mapColumnsToSearchCategories(table.columns, name, matcher);
    if (items.length) {
      memo.push({ heading: name, items });
    }
    return memo;
  }, [])
);

const getColumnValues = createSelector(
  getSelectedCategory,
  getTables,
  getSearchText,
  getSearchTextMatcher,
  getActiveGenomes,
  (category, tables, text, matcher, genomes) => {
    const table = tables[category.tableName];
    const column = findColumn(table.columns, category.key);

    const map = new Map();
    const contains = [];

    for (const genome of genomes) {
      const value = column.valueGetter(genome);
      if (value === null || typeof value === 'undefined') continue;
      const matches = matcher && matcher.test(value);
      if (matches) contains.push(genome.id);
      if (matcher ? matches : value.length) {
        const item = map.get(value) || { key: value, label: value, ids: [] };
        item.ids.push(genome.id);
        map.set(value, item);
      }
    }

    return [
      { heading: 'Contains',
        items: contains.length ? [ { key: 'contains', label: text, ids: contains } ] : [] },
      { heading: 'Matches', items: Array.from(map.values()) },
    ];
  }
);

export const getSearchItems = state => {
  if (getSelectedCategory(state)) {
    return getColumnValues(state);
  }
  return getTableColumns(state);
};
