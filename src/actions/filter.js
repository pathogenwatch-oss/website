
export const ACTIVATE_FILTER = 'ACTIVATE_FILTER';

export function activateFilter(ids) {
  return {
    type: ACTIVATE_FILTER,
    ids: new Set(ids),
  };
}

export const APPEND_TO_FILTER = 'APPEND_TO_FILTER';

export function appendToFilter(ids) {
  return {
    type: APPEND_TO_FILTER,
    ids: new Set(ids),
  };
}


export const SET_UNFILTERED_IDS = 'SET_UNFILTERED_IDS';

export function setUnfilteredIds(ids) {
  return {
    type: SET_UNFILTERED_IDS,
    ids: new Set(ids),
  };
}


export const RESET_FILTER = 'RESET_FILTER';

export function resetFilter() {
  return { type: RESET_FILTER };
}
