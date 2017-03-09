import { getGenomesInPath } from './selectors';

import { setSelection } from '../selection/actions';

export const SET_LASSO_PATH = 'SET_LASSO_PATH';

export function setLassoPath(path) {
  return {
    type: SET_LASSO_PATH,
    payload: {
      path,
    },
  };
}

export function selectByArea(path) {
  return (dispatch, getState) => {
    dispatch(setLassoPath(path));
    const state = getState();
    dispatch(setSelection(getGenomesInPath(state)));
  };
}
