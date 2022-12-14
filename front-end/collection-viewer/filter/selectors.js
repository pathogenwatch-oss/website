import { createSelector } from 'reselect';

import { getNetworkFilteredIds } from '~/cluster-viewer/selectors';
import { getUnfilteredGenomeIds } from '../genomes/selectors';
import { getTreeFilteredIds, getTreeUnfilteredIds } from '../tree/selectors';
import { getTimelineFilteredIds } from '../timeline/selectors';

import { filterKeys } from '../filter/constants';

const getViewer = state => state.viewer;

const getSearchTerms = state => getViewer(state).search.intersections;

const getSearchIds = createSelector(
  getSearchTerms,
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
  getTreeFilteredIds,
  getTimelineFilteredIds,
  (filterState, networkIds = [], treeIds = [], timelineIds = []) => {
    const intersections = [];

    if (filterState[filterKeys.MAP].active) {
      intersections.push(filterState[filterKeys.MAP].ids);
    }
    if (networkIds.length) {
      intersections.push(new Set(networkIds));
    }
    if (treeIds && treeIds.length) {
      intersections.push(new Set(treeIds));
    }
    if (timelineIds && timelineIds.length) {
      intersections.push(new Set(timelineIds));
    }
    if (filterState[filterKeys.VISIBILITY].active) {
      intersections.push(filterState[filterKeys.VISIBILITY].ids);
    }

    return intersections;
  }
);

const getUnfilteredIds = createSelector(
  getUnfilteredGenomeIds,
  getTreeUnfilteredIds,
  (genomeIds, treeIds) => (treeIds.length ? treeIds : genomeIds)
);

const getTotal = createSelector(
  getUnfilteredGenomeIds,
  ids => ids.length
);

const getFilterIds = createSelector(
  getNonSearchFilterIntersections,
  getSearchTerms,
  getSearchIds,
  (nonSearchIntersections, searchTerms, searchIds) => {
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
    return new Set(ids);
  }
);

const isFilterActive = createSelector(
  getSearchTerms,
  getFilterIds,
  (terms, ids) => !!terms.length || !!ids.size
);

export const getFilter = createSelector(
  getUnfilteredIds,
  getTotal,
  getFilterIds,
  isFilterActive,
  (unfilteredIds, total, ids, active) => ({
    unfilteredIds,
    total,
    ids,
    active,
    count: active ? ids.size : unfilteredIds.length,
  })
);

export const getFilteredGenomeIds = createSelector(
  getFilter,
  filter => Array.from(filter.active ? filter.ids : filter.unfilteredIds)
);
