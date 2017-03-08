import { getCollection } from '../selectors';
import { getSubtreeNames } from '../tree/selectors';

import { statuses } from './constants';
import { API_ROOT } from '../../utils/Api';

export const SET_OFFLINE_STATUS = 'SET_OFFLINE_STATUS';

function setStatus(status) {
  return {
    type: SET_OFFLINE_STATUS,
    payload: {
      status,
    },
  };
}

export function saveForOffline() {
  return (dispatch, getState) => {
    const state = getState();
    const { uuid } = getCollection(state);
    const subtrees = getSubtreeNames(state);

    dispatch(setStatus(statuses.SAVING));
    return (
      caches
        .open(`wgsa-collection-${uuid}`)
        .then(cache =>
          cache.addAll(
            subtrees
              .map(subtree => `${API_ROOT}/collection/${uuid}/subtree/${subtree}`)
              .concat(`${API_ROOT}/collection/${uuid}`)
          )
        )
        .then(() => dispatch(setStatus(statuses.SAVED)))
    );
  };
}
