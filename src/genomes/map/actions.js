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
