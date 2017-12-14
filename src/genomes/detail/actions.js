import { createAsyncConstants } from '../../actions';

import { showToast } from '../../toast';
import { fetchGenomeList, fetchGenomeSummary } from '../actions';
import { fetchSummary } from '../../summary/actions';
import { clearSelection } from '../selection/actions';

import { stateKey } from '../filter';
import { getFilter } from '../../filter/selectors';

import { fetchGenome } from './api';
import { binGenomes } from '../api';
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

export function setBinnedFlag(genomes, isBinned, undoable = true) {
  return (dispatch, getState) => {
    const currentFilter = getFilter(getState(), { stateKey });
    const undo = () => dispatch(setBinnedFlag(genomes, !isBinned, false));
    return (
      binGenomes(genomes.map(_ => _.id), isBinned)
        .then(({ binned }) => {
          if (binned === 0) return Promise.resolve();
          if (genomes.length > 1) dispatch(clearSelection());
          return Promise.all([
            dispatch(fetchGenomeList()),
            dispatch(fetchGenomeSummary(currentFilter)),
            dispatch(fetchSummary()),
          ])
          .then(() => undoable &&
            dispatch(showToast(toasts.undoMoveToBin(binned, !isBinned, undo)))
          );
        })
        .catch(() => dispatch(showToast({
          message: 'Something went wrong, please try again later.',
        })))
    );
  };
}
