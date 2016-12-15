import * as actions from './actions';

import { getCollection } from './selectors';

import { statuses } from './constants';

export function fetchCollection(id) {
  return (dispatch, getState) => {
    dispatch(actions.fetchCollection(id)).
      then(() => {
        const state = getState();
        const { speciesId, status } = getCollection(state);
        if (status === statuses.READY) {
          dispatch(actions.fetchSpeciesData(speciesId));
        }
      });
  };
}
