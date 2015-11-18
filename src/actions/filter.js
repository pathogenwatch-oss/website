
export const ACTIVATE_FILTER = 'ACTIVATE_FILTER';

export function activateFilter(ids) {
  return {
    type: ACTIVATE_FILTER,
    ids,
  };
}


export const RESET_FILTER = 'RESET_FILTER';

export function resetFilter() {
  return { type: RESET_FILTER };
}
