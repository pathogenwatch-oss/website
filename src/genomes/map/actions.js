import { createAsyncConstants } from '../../actions';

import { getGenomesInPath } from './selectors';

import { changeLassoPath } from '../../map/actions';

import { fetchSelection } from '../api';

export const SHOW_MARKER_POPUP = createAsyncConstants('SHOW_MARKER_POPUP');

export function showMarkerPopup(ids, position = '') {
  return {
    type: SHOW_MARKER_POPUP,
    payload: {
      position,
      promise: fetchSelection(ids),
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
      dispatch(showMarkerPopup(getGenomesInPath(state, { stateKey }), path));
    }
  };
}
