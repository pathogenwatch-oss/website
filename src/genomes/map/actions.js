import { createAsyncConstants } from '../../actions';

import { getGenomesInPath } from './selectors';

import { setSelection } from '../selection/actions';
import { changeLassoPath } from '../../map/actions';

import { fetchSelection } from '../api';

export function selectByArea(stateKey, path) {
  return (dispatch, getState) => {
    dispatch(changeLassoPath(stateKey, path));
    const state = getState();
    dispatch(setSelection(getGenomesInPath(state, { stateKey })));
  };
}

export const TOGGLE_MARKER_POPUP = createAsyncConstants('TOGGLE_MARKER_POPUP');

export function toggleMarkerPopup(marker) {
  return {
    type: TOGGLE_MARKER_POPUP,
    payload: {
      position: marker.position,
      promise: fetchSelection(marker.genomes),
    },
  };
}
