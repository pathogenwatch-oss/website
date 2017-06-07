import { showToast } from '../toast';
import { updateFilter } from './filter/actions';
import { fetchSummary } from '../summary/actions';

import { getPrefilter } from './filter/selectors';

import { binGenome } from './api';
import * as toasts from './utils/toasts';

export function moveToBin(genome, status, undoable = true) {
  return (dispatch, getState) => {
    const prefilter = getPrefilter(getState());
    const undo = () => dispatch(moveToBin(genome, !status, false));
    return (
      binGenome(genome.id, status)
        .then(() => Promise.all([
          dispatch(updateFilter({ prefilter }, true)),
          dispatch(fetchSummary()),
        ]))
        .then(() => undoable && dispatch(showToast(toasts.undoMoveToBin(genome, undo))))
        .catch(() => dispatch(showToast({
          message: 'Something went wrong, please try again later.',
        })))
    );
  };
}
