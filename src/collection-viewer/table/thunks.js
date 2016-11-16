import { resetFilter, activateFilter } from '../filter/actions';

import { getFilter } from '../selectors';

export function onTableClick({ target }) {
  return dispatch => {
    if (target.classList.contains('public_Scrollbar_face') ||
        target.classList.contains('public_Scrollbar_main')) {
      return;
    }
    dispatch(resetFilter());
  };
}

export function onRowClick(assembly) {
  return (dispatch, getState) => {
    const state = getState();
    const { ids, active } = getFilter(state);

    if (active && ids.size === 1 && ids.has(assembly.id)) {
      dispatch(resetFilter());
    } else {
      dispatch(activateFilter([ assembly.id ]));
    }
  };
}
