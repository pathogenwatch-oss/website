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
    payload: category,
  };
}
