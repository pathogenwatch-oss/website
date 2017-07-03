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

export const SEARCH_ITEM_SELECTED = 'SEARCH_ITEM_SELECTED';

export function selectSearchItem(item) {
  return {
    type: SEARCH_ITEM_SELECTED,
    payload: {
      item,
    },
  };
}

export const SEARCH_ITEM_REMOVED = 'SEARCH_ITEM_REMOVED';

export function removeSearchItem(item) {
  return {
    type: SEARCH_ITEM_REMOVED,
    payload: {
      item,
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
