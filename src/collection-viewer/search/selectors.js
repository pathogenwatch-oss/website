import { createSelector } from 'reselect';

import { getViewer, getGenomeList } from '../selectors';
import { getTables } from '../table/selectors';

import { tableDisplayNames } from '../constants';
import {
  mapColumnsToSearchCategories,
  findColumn,
  getValueLabel,
  getExpressionMatcher,
  sortFns,
} from './utils';

export const getSearch = state => getViewer(state).search;

export const getSelectedCategory = state => getSearch(state).category;
export const getSearchText = state => getSearch(state).text;
export const getSearchTextMatcher = createSelector(
  getSelectedCategory,
  getSearchText,
  (category, text) => {
    if (!text.length) return null;
    if (category && category.numeric) {
      return getExpressionMatcher(text);
    }
    return new RegExp(text.replace('?', '\\?'), 'i');
  }
);

export const getDropdownVisibility = state => getSearch(state).visible;
export const getSearchCursor = state => getSearch(state).cursor;
export const getSearchSort = state => getSearch(state).sort;

export const getRecentSearches = createSelector(
  getSearch,
  search => Array.from(search.recent)
);

export const getSearchTerms = createSelector(
  getSearch,
  search => search.intersections
);

const getCurrentIntersection = createSelector(
  getSearch,
  search => search.intersections[search.currentIntersection]
);

const getTableColumns = createSelector(
  getTables,
  getSearchTextMatcher,
  (tables, matcher) => Object.keys(tables).reduce((memo, key) => {
    const table = tables[key];
    const items = mapColumnsToSearchCategories(table.columns, key, matcher);
    if (items.length) {
      memo.push({ heading: tableDisplayNames[key], items });
    }
    return memo;
  }, [])
);

function getContainsSection(category, text, ids) {
  const items =
    ids.length ?
      [ { key: 'contains', label: text, ids } ] :
      [];
  let placeholder = '';
  if (!text.length) {
    placeholder = category.numeric ?
      'Enter expression: =, <, >, <=, >=' :
      'Enter text';
  }
  return {
    heading: category.numeric ? 'Expression' : 'Contains',
    placeholder,
    items,
  };
}

const isSelected = (terms, category, value) => terms.some(
  term => term.category.key === category.key && term.value.key === value
);

const getColumnValues = createSelector(
  getSelectedCategory,
  getTables,
  getSearchText,
  getSearchTextMatcher,
  getGenomeList,
  getSearchSort,
  getCurrentIntersection,
  (category, tables, text, matcher, genomes, sort, terms) => {
    const table = tables[category.tableName];
    const column = findColumn(table.columns, category.key);

    const map = new Map();
    const contains = [];

    for (const genome of genomes) {
      const value = column.valueGetter(genome);
      if (value === null || typeof value === 'undefined') continue;
      if (terms && terms.length && isSelected(terms, category, value)) continue;
      const label = getValueLabel(value, category.tableName);
      const matches = matcher && matcher.test(label);
      if (matches) contains.push(genome.uuid);
      if (matcher ? matches : label) {
        const item = map.get(value) || { key: value, label, ids: [] };
        item.ids.push(genome.uuid);
        map.set(value, item);
      }
    }

    return [
      getContainsSection(category, text, contains),
      { heading: 'Matches',
        items: Array.from(map.values()).sort(sortFns[sort]),
        placeholder: 'No results',
        sort: true,
      },
    ];
  }
);

export const getSearchItems = state => {
  if (getSelectedCategory(state)) {
    return getColumnValues(state);
  }
  return getTableColumns(state);
};

export const getItemAtCursor = createSelector(
  getSearchItems,
  getSearchCursor,
  (sections, cursor) => {
    let i = cursor;
    for (const { items } of sections) {
      if (i >= items.length) { i -= items.length; continue; }
      return items[i];
    }
    const { items } = sections[sections.length - 1];
    return items[items.length - 1] || null;
  }
);
