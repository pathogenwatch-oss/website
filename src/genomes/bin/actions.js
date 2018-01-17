import { stateKey } from '../filter';
import { getFilter } from '../../filter/selectors';

import { showToast } from '../../toast';
import { fetchGenomeList, fetchGenomeSummary } from '../actions';
import { fetchSummary } from '../../summary/actions';
import { unselectGenomes } from '../selection/actions';

import { binGenomes } from '../api';
import * as toasts from '../utils/toasts';

export function setBinnedFlag(genomes, isBinned, undoable = true) {
  return (dispatch, getState) => {
    const currentFilter = getFilter(getState(), { stateKey });
    const undo = () => dispatch(setBinnedFlag(genomes, !isBinned, false));
    return (
      binGenomes(genomes.map(_ => _.id), isBinned)
        .then(({ binned }) => {
          if (binned === 0) return Promise.resolve();
          dispatch(unselectGenomes(genomes));
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

