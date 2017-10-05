import { createSelector } from 'reselect';

import { getViewer, getGenomeList } from '../selectors';
import {
  getTables,
  getActiveDataTable,
  getVisibleTableName,
} from '../table/selectors';

import { tableDisplayNames } from '../constants';
import { modes } from './constants';
import {
  mapColumnsToSearchCategories,
  getNameCategory,
  findColumn,
  getValueLabel,
  getExpressionMatcher,
  getTextMatcher,
  sortFns,
} from './utils';
import { getColumnLabel } from '../table/utils';

export const getSearch = state => getViewer(state).search;

export const getSelectedCategory = state => getSearch(state).category;
export const getSearchText = state => getSearch(state).text;
export const getSearchCursor = state => getSearch(state).cursor;
export const getSearchSort = state => getSearch(state).sort;
export const getSearchMode = state => (
  getSearch(state).advanced ?
    modes.ADVANCED :
    modes.BASIC
);
export const isAdvancedMode = state => getSearch(state).advanced;
export const isExactMatch = state => getSearch(state).exact;

export const getSearchTextMatcher = createSelector(
  getSelectedCategory,
  getSearchText,
  isExactMatch,
  (category, text, exact) => {
    if (!text.length) return null;
    let matcher;
    if (category && category.numeric) {
      matcher = getExpressionMatcher(text);
    }
    if (!matcher) matcher = getTextMatcher(text, exact);
    return matcher;
  }
);

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
  getVisibleTableName,
  (tables, matcher, visibleTable) => Object.keys(tables).reduce((memo, key) => {
    const table = tables[key];
    const items = mapColumnsToSearchCategories(table.columns, key, matcher);
    // ensure name category is always visible under "metadata" section,
    // even if metadata table not visible
    if (table === tables.metadata) {
      const category = getNameCategory(visibleTable, matcher);
      if (category) items.unshift(category);
    }
    if (items.length) {
      memo.push({ heading: tableDisplayNames[key], items });
    }
    return memo;
  }, [])
);

function getContainsSection(category, text, ids) {
  const items =
    ids.length ?
      [ { key: `contains_${text}`, label: text, ids, isExpression: true } ] :
      [];
  const placeholder =
    category.numeric ?
      'Enter expression: =, <, >, <=, >=' :
      'Enter text';
  return {
    heading: category.numeric ? 'Expression' : 'Contains',
    placeholder,
    items,
  };
}

const getColumnValues = createSelector(
  getSelectedCategory,
  getTables,
  getSearchText,
  getSearchTextMatcher,
  getGenomeList,
  getSearchSort,
  getCurrentIntersection,
  (category, tables, text, matcher, genomes, sort, currentTerms = []) => {
    const table = tables[category.tableName];
    const column = findColumn(table.columns, category.key);

    const map = new Map();
    const contains = [];

    for (const genome of genomes) {
      const value = column.valueGetter(genome);
      if (value === null || typeof value === 'undefined') continue;
      if (currentTerms.some(term =>
        (term.category.key === category.key && term.value.key === value) || // value already selected
        !term.value.ids.includes(genome.uuid) // genome not in intersection
      )) continue;
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
    if (sections.length === 0) return null;
    let i = cursor;
    for (const { items } of sections) {
      if (i >= items.length) { i -= items.length; continue; }
      return items[i];
    }
    const { items } = sections[sections.length - 1];
    return items[items.length - 1] || null;
  }
);

export const getSearchPlaceholder = createSelector(
  getSearch,
  getActiveDataTable,
  ({ advanced, category }, table) => {
    if (advanced) {
      return `FILTER ${category ? category.label : 'COLUMNS'}`;
    }
    return `FILTER ${getColumnLabel(table.activeColumn)}`;
  }
);
