import { createSelector } from 'reselect';

import { getNetworkFilteredIds } from '~/cluster-viewer/selectors';

import { filterKeys } from '../filter/constants';

const getViewer = state => state.viewer;

const getSearchIds = createSelector(
  state => getViewer(state).search.intersections,
  intersections => intersections.reduce((memo, terms) => {
    let ids = terms[0].value.ids;
    for (const { value } of terms.slice(1)) {
      ids = ids.filter(id => value.ids.indexOf(id) !== -1);
    }
    return memo.concat(ids);
  }, [])
);

export const getFilterState = state => getViewer(state).filter;

export const getNonSearchFilterIntersections = createSelector(
  getFilterState,
  getNetworkFilteredIds,
  (filterState, networkIds = []) => {
    const intersections = [];

    if (filterState[filterKeys.VISIBILITY].active) {
      intersections.push(filterState[filterKeys.VISIBILITY].ids);
    }
    if (filterState[filterKeys.TREE].active) {
      intersections.push(filterState[filterKeys.TREE].ids);
    }
    if (filterState[filterKeys.MAP].active) {
      intersections.push(filterState[filterKeys.MAP].ids);
    }
    if (networkIds.length) {
      intersections.push(new Set(networkIds));
    }

    return intersections;
  }
);

export const getFilter = createSelector(
  getFilterState,
  getNonSearchFilterIntersections,
  state => getViewer(state).search.intersections,
  getSearchIds,
  (filterState, nonSearchIntersections, searchTerms, searchIds) => {
    const intersections = [ ...nonSearchIntersections ];
    if (searchTerms.length) {
      intersections.push(new Set(searchIds));
    }

    const ids = new Set(intersections[0]);
    for (const intersection of intersections.slice(1)) {
      for (const id of ids) {
        if (!intersection.has(id)) {
          ids.delete(id);
        }
      }
    }

    return {
      unfilteredIds: filterState.unfilteredIds,
      ids: new Set(ids),
      active: intersections.length,
    };
  }
);

export const getUnfilteredGenomeIds = state => getFilter(state).unfilteredIds;

export const getFilteredGenomeIds = createSelector(
  getFilter,
  filter => Array.from(filter.active ? filter.ids : filter.unfilteredIds)
);
