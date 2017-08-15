import {
  selectSearchCategory,
  addSearchTerm,
  changeSearchText,
} from './actions';
import { resetFilter } from '../filter/actions';

import { getSearch, getItemAtCursor } from './selectors';
import { getGenomeList } from '../selectors';
import { getTables } from '../table/selectors';

import { createSearchTerm, getTextMatcher, findColumn } from './utils';

export function selectSearchItem(item) {
  return (dispatch, getState) => {
    const search = getSearch(getState());
    if (search.recent.has(item)) {
      dispatch(addSearchTerm(item));
    } else if (search.category) {
      const term = createSearchTerm(search.category, item);
      dispatch(addSearchTerm(term));
    } else {
      dispatch(selectSearchCategory(item));
    }
  };
}

export function selectItemAtCursor() {
  return (dispatch, getState) => {
    const item = getItemAtCursor(getState());
    if (item) {
      dispatch(selectSearchItem(item));
    }
  };
}

export function searchTextChanged(text) {
  return (dispatch, getState) => {
    const state = getState();
    const search = getSearch(state);
    const { advanced, exact } = search;
    if (advanced) {
      dispatch(changeSearchText(text));
    } else if (text.length === 0) {
      dispatch(resetFilter());
    } else {
      const category = { label: 'NAME', tableName: 'metadata', key: '__name' };
      const genomes = getGenomeList(state);
      const table = getTables(state)[category.tableName];
      const ids = [];
      const matcher = getTextMatcher(text, exact);
      const column = findColumn(table.columns, category.key);
      for (const genome of genomes) {
        const value = column.valueGetter(genome);
        if (matcher.test(value)) {
          ids.push(genome.uuid);
        }
      }
      const item = { key: 'contains', label: text, ids };
      const term = createSearchTerm(category, item);
      dispatch(addSearchTerm(term));
    }
  };
}
