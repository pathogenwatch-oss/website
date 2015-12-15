
export const ACTIVATE_FILTER = 'ACTIVATE_FILTER';

export function activateFilter(ids) {
  return {
    type: ACTIVATE_FILTER,
    ids,
  };
}

export const SET_UNFILTERED_IDS = 'SET_UNFILTERED_IDS';

export function setUnfilteredIds(ids) {
  return {
    type: SET_UNFILTERED_IDS,
    ids,
  };
}


export const RESET_FILTER = 'RESET_FILTER';

export function resetFilter() {
  return { type: RESET_FILTER };
}
