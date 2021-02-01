import * as actions from './actions';
import { fetchSummary } from '../summary/actions';
import { showToast } from '../toast';

import { getFilter } from './filter/selectors';

import { binCollection } from './api';
import { undoMoveToBin } from './toasts';

export function setBinnedStatus(collection, status, undoable = true) {
  return (dispatch, getState) => {
    const currentFilter = getFilter(getState());
    const undo = () => dispatch(setBinnedStatus(collection, !status, false));
    return (
      binCollection(collection.token, status)
        .then(() => Promise.all([
          dispatch(actions.fetchCollections(currentFilter)),
          dispatch(actions.fetchSummary(currentFilter)),
          dispatch(fetchSummary()),
        ]))
        .then(() => undoable && dispatch(showToast(undoMoveToBin(collection, undo))))
        .catch((e) => {
          dispatch(showToast({
            message: 'Something went wrong, please try again later.',
          }));
          throw e;
        })
    );
  };
}
