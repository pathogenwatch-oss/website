import { stateKey } from './index';

import { actions } from '../../filter';
import { fetchGenomes, fetchSummary } from '../actions';

import { getFilter } from './selectors';
import { getUploadedAt } from '../uploads/selectors';

export function updateFilter(query, updateQueryString = true) {
  return (dispatch, getState) => {
    const update = updateQueryString ? actions.update : actions.updateFilter;
    dispatch(update(stateKey, query));

    const state = getState();
    const currentFilter = getFilter(state);
    const uploadedAt = getUploadedAt(state);

    const filterQuery = { ...currentFilter };

    if (currentFilter.prefilter === 'upload') {
      // if (!uploadedAt) return;
      filterQuery.uploadedAt = uploadedAt;
    }

    if ('prefilter' in query) {
      dispatch(fetchSummary(filterQuery));
    }
    dispatch(fetchGenomes(filterQuery));
  };
}

export function clearFilter() {
  return (dispatch, getState) => {
    dispatch(actions.clear(stateKey));

    const filter = getFilter(getState());
    dispatch(fetchGenomes(filter));
  };
}
