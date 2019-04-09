import { createAsyncConstants } from '../../actions';

import { getPositionsInPath } from './selectors';

import { changeLassoPath } from '../../map/actions';

import { fetchByCoordinates } from './api';

export const SHOW_MARKER_POPUP = createAsyncConstants('SHOW_MARKER_POPUP');

export function showMarkerPopup(positions = []) {
  return {
    type: SHOW_MARKER_POPUP,
    payload: {
      promise: fetchByCoordinates(positions),
    },
  };
}

export const CLOSE_MARKER_POPUP = 'CLOSE_MARKER_POPUP';

export function closeMarkerPopup() {
  return {
    type: CLOSE_MARKER_POPUP,
  };
}

export function selectByArea(stateKey, path) {
  return (dispatch, getState) => {
    dispatch(changeLassoPath(stateKey, path));
    const state = getState();
    if (path) {
      dispatch(showMarkerPopup(getPositionsInPath(state, { stateKey }), path));
    }
  };
}
