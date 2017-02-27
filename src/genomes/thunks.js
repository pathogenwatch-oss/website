import actions from './actions';

import { showToast } from '../toast';

import * as toasts from './utils/toasts';

export function moveToBin(genome) {
  return (dispatch) => {
    dispatch(actions.moveToBin(genome.id));
    dispatch(showToast(toasts.undoMoveToBin(genome, dispatch)));
  };
}
