import { createSelector } from 'reselect';

import { getViewer } from '../selectors';
import { getTables } from '../table/selectors';

import { mapColumnsToSearchCategories } from './utils';

export const getSearch = state => getViewer(state).search;

export const getSearchText = state => getSearch(state).text;
export const getSearchTextMatcher = createSelector(
  getSearchText,
  text => (text.length ? new RegExp(text, 'i') : null)
);

export const getSearchCategories = createSelector(
  getTables,
  getSearchTextMatcher,
  (tables, matcher) => Object.keys(tables).reduce((memo, name) => {
    const table = tables[name];
    const columns = mapColumnsToSearchCategories(table.columns, name, matcher);
    if (columns.length) {
      memo.push({ name, columns });
    }
    return memo;
  }, [])
);

export const getSelectedCategory = state => getSearch(state).category;
export const getDropdownVisibility = state => getSearch(state).visible;
