import { getSearch, getItemAtCursor } from './selectors';
import { selectSearchCategory, addSearchTerm } from './actions';

import { createSearchTerm } from './utils';

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
