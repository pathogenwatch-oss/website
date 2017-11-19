import { createAsyncConstants } from '../../actions';

import { showToast } from '../../toast';
import { fetchGenomeList, fetchGenomeSummary } from '../actions';
import { fetchSummary } from '../../summary/actions';

import { stateKey } from '../filter';
import { getFilter } from '../../filter/selectors';

import { fetchGenome } from './api';
import { binGenome } from '../api';
import * as toasts from '../utils/toasts';

export const SHOW_GENOME_DETAILS = createAsyncConstants('SHOW_GENOME_DETAILS');

export function showGenomeDrawer(id, name) {
  return {
    type: SHOW_GENOME_DETAILS,
    payload: {
      name,
      promise: fetchGenome(id),
    },
  };
}

export const CLOSE_DRAWER = 'CLOSE_DRAWER';

export function closeDrawer() {
  return {
    type: CLOSE_DRAWER,
  };
}

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
