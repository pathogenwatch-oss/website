import { stateKey } from './index';

import { actions } from '../../filter';
import { fetchGenomeSummary, fetchGenomeList } from '../actions';

import { getFilter } from './selectors';

import { checkStale } from '../../actions';

export function updateFilterValue(filterMap) {
  return actions.update(stateKey, filterMap);
}

export function applyFilter() {
  return checkStale(fetchGenomeSummary, getFilter);
}

export function updateFilter(query, updateQueryString = true) {
  return (dispatch) => {
    if (updateQueryString) {
      dispatch(updateFilterValue(query));
    } else {
      dispatch(actions.setFilter(stateKey, query));
    }

    const queryKeys = Object.keys(query);
    if (queryKeys.length === 1 && queryKeys[0] === 'sort') {
      dispatch(fetchGenomeList());
    } else {
      dispatch(applyFilter());
    }
  };
}

export function clearFilter() {
  return (dispatch, getState) => {
    dispatch(actions.clear(stateKey));

    const filter = getFilter(getState());
    return dispatch(fetchGenomeSummary(filter));
  };
}

export const GENOMES_FILTER_OPENED = 'GENOMES_FILTER_OPENED';

export function toggleFilter() {
  return {
    type: GENOMES_FILTER_OPENED,
  };
}
