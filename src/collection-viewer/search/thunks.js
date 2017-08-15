import {
  selectSearchCategory,
  addSearchTerm,
  changeSearchText,
  toggleSearchExactMatch,
} from './actions';
import { resetFilter } from '../filter/actions';

import { getSearch, getItemAtCursor } from './selectors';
import { getGenomeList } from '../selectors';
import { getActiveDataTable, getDataTableName } from '../table/selectors';

import { createSearchTerm, createBasicSearchTerm } from './utils';

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

function getBasicSearchTerm(state, text, exact) {
  const tableName = getDataTableName(state);
  const table = getActiveDataTable(state);
  const genomes = getGenomeList(state);
  return createBasicSearchTerm(tableName, table, genomes, text, exact);
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
      const term = getBasicSearchTerm(state, text, exact);
      dispatch(addSearchTerm(term));
    }
  };
}

export function searchExactMatchToggled() {
  return (dispatch, getState) => {
    const state = getState();
    const search = getSearch(state);
    const { text, exact } = search;
    const term = text.length ? getBasicSearchTerm(state, text, !exact) : false;
    dispatch(toggleSearchExactMatch(term));
  };
}
