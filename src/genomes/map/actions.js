import { getGenomesInPath } from './selectors';

import { setSelection } from '../selection/actions';
import { changeLassoPath } from '../../map/actions';

export function selectByArea(stateKey, path) {
  return (dispatch, getState) => {
    dispatch(changeLassoPath(stateKey, path));
    const state = getState();
    dispatch(setSelection(getGenomesInPath(state, { stateKey })));
  };
}

export const TOGGLE_MARKER_POPUP = 'TOGGLE_MARKER_POPUP';

export function toggleMarkerPopup(position) {
  return {
    type: TOGGLE_MARKER_POPUP,
    payload: position.join(','),
  };
}
