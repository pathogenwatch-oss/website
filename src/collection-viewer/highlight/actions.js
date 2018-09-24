export const SET_HIGHLIGHT = 'SET_HIGHLIGHT';

export function setHighlight(ids, append) {
  return {
    type: SET_HIGHLIGHT,
    payload: {
      ids,
      append,
    },
  };
}

export const REMOVE_FROM_HIGHLIGHT = 'REMOVE_FROM_HIGHLIGHT';

export function removeFromHighlight(ids) {
  return {
    type: REMOVE_FROM_HIGHLIGHT,
    payload: {
      ids,
    },
  };
}

export const CLEAR_HIGHLIGHT = 'CLEAR_HIGHLIGHT';

export function clearHighlight() {
  return {
    type: CLEAR_HIGHLIGHT,
    payload: {},
  };
}
