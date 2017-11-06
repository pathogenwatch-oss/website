import { showToast } from '../../toast';
import { fetchGenomeList, fetchGenomeSummary } from '../actions';
import { fetchSummary } from '../../summary/actions';

import { stateKey } from '../filter';
import { getFilter } from '../../filter/selectors';

import { binGenome } from '../api';
import * as toasts from '../utils/toasts';

export function setBinnedStatus(genome, status, undoable = true) {
  return (dispatch, getState) => {
    const currentFilter = getFilter(getState(), { stateKey });
    const undo = () => dispatch(setBinnedStatus(genome, !status, false));
    return (
      binGenome(genome.id, status)
        .then(() => Promise.all([
          dispatch(fetchGenomeList()),
          dispatch(fetchGenomeSummary(currentFilter)),
          dispatch(fetchSummary()),
        ]))
        .then(() => undoable && dispatch(showToast(toasts.undoMoveToBin(genome, undo))))
        .catch(() => dispatch(showToast({
          message: 'Something went wrong, please try again later.',
        })))
    );
  };
}
