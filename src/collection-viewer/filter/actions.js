
export const ACTIVATE_FILTER = 'ACTIVATE_FILTER';

export function activateFilter(ids) {
  return {
    type: ACTIVATE_FILTER,
    payload: {
      ids: new Set(ids),
    },
  };
}

export const APPEND_TO_FILTER = 'APPEND_TO_FILTER';

export function appendToFilter(ids) {
  return {
    type: APPEND_TO_FILTER,
    payload: {
      ids: new Set(ids),
    },
  };
}

export const REMOVE_FROM_FILTER = 'REMOVE_FROM_FILTER';

export function removeFromFilter(ids) {
  return {
    type: REMOVE_FROM_FILTER,
    payload: {
      ids: new Set(ids),
    },
  };
}

export const SET_UNFILTERED_IDS = 'SET_UNFILTERED_IDS';

export function setUnfilteredIds(ids) {
  return {
    type: SET_UNFILTERED_IDS,
    payload: {
      ids: new Set(ids),
    },
  };
}


export const RESET_FILTER = 'RESET_FILTER';

export function resetFilter() {
  return { type: RESET_FILTER };
}
