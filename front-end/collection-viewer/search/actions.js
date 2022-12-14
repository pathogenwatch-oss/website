export const SEARCH_DROPDOWN_VISIBILITY = 'SEARCH_DROPDOWN_VISIBILITY';

export function changeDropdownVisibility(isVisible) {
  return {
    type: SEARCH_DROPDOWN_VISIBILITY,
    payload: isVisible,
  };
}

export const SEARCH_TEXT_CHANGED = 'SEARCH_TEXT_CHANGED';

export function changeSearchText(text) {
  return {
    type: SEARCH_TEXT_CHANGED,
    payload: text,
  };
}

export const SEARCH_CATEGORY_SELECTED = 'SEARCH_CATEGORY_SELECTED';

export function selectSearchCategory(category) {
  return {
    type: SEARCH_CATEGORY_SELECTED,
    payload: {
      category,
    },
  };
}

export const SEARCH_TERM_ADDED = 'SEARCH_TERM_ADDED';

export function addSearchTerm(term) {
  return {
    type: SEARCH_TERM_ADDED,
    payload: term,
  };
}

export const SEARCH_TERM_REMOVED = 'SEARCH_TERM_REMOVED';

export function removeSearchTerm(term, intersection) {
  return {
    type: SEARCH_TERM_REMOVED,
    payload: {
      term,
      intersection,
    },
  };
}

export const SEARCH_CURSOR_MOVED = 'SEARCH_CURSOR_MOVED';

export function moveCursor(delta) {
  return {
    type: SEARCH_CURSOR_MOVED,
    payload: {
      delta,
    },
  };
}

export const SEARCH_INTERSECTION_MOVED = 'SEARCH_INTERSECTION_MOVED';

export function moveIntersection(delta) {
  return {
    type: SEARCH_INTERSECTION_MOVED,
    payload: {
      delta,
    },
  };
}

export const SEARCH_SORT_SELECTED = 'SEARCH_SORT_SELECTED';

export function selectSort(sort) {
  return {
    type: SEARCH_SORT_SELECTED,
    payload: sort,
  };
}

export const SEARCH_OPERATOR_SELECTED = 'SEARCH_OPERATOR_SELECTED';

export function selectNextOperator(operator) {
  return {
    type: SEARCH_OPERATOR_SELECTED,
    payload: operator,
  };
}

export const SEARCH_TOGGLE_MODE = 'SEARCH_TOGGLE_MODE';

export function toggleSearchMode() {
  return {
    type: SEARCH_TOGGLE_MODE,
  };
}

export const SEARCH_TOGGLE_EXACT_MATCH = 'SEARCH_TOGGLE_EXACT_MATCH';

export function toggleSearchExactMatch(term) {
  return {
    type: SEARCH_TOGGLE_EXACT_MATCH,
    payload: term,
  };
}
