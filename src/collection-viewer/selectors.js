import { createSelector } from 'reselect';
import removeMarkdown from 'remove-markdown';

import { getTableState, getAMRTableName } from './table/selectors';
import { getNetworkFilteredIds } from '../cluster-viewer/selectors';

import { createColourGetter } from './amr-utils';
import { filterKeys } from './filter/constants';

export const getViewer = ({ viewer }) => viewer;

export const getCollection = state => getViewer(state).entities.collection;
export const getGenomes = state => getViewer(state).entities.genomes;
export const isClusterView = state => getCollection(state).isClusterView;

export const getCollectionTitle = createSelector(
  getCollection,
  ({ title }) => (title ? removeMarkdown(title) : null)
);

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
  state => getViewer(state).filter,
  getNetworkFilteredIds,
  (filterState, searchTerms, searchIds, networkIds = []) => {
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

export const getFilteredGenomes = createSelector(
  getGenomes,
  getFilter,
  (genomes, filter) => {
    const { active, ids, unfilteredIds } = filter;
    return Array.from(active ? ids : unfilteredIds).map(id => genomes[id]);
  }
);

export const getGenomeList = createSelector(
  getGenomes,
  getUnfilteredGenomeIds,
  (genomes, ids) => Array.from(ids).map(id => genomes[id])
);

export const getHighlightedIds = createSelector(
  getFilterState,
  filter => filter[filterKeys.HIGHLIGHT].ids
);

export const getActiveGenomeIds = createSelector(
  getFilter,
  filter => Array.from(filter.active ? filter.ids : filter.unfilteredIds)
);

export const getActiveGenomes = createSelector(
  getGenomes,
  getActiveGenomeIds,
  getHighlightedIds,
  (genomes, visible, highlighted) =>
    Array.from(highlighted.size ? highlighted : visible).map(id => genomes[id])
);

export const getColourGetter = createSelector(
  getTableState,
  getAMRTableName,
  (tables, name) => createColourGetter(tables.entities[name], tables.multi)
);

export const getCollectionMetadata = createSelector(
  getCollection,
  collection => ({
    title: collection.title,
    description: collection.description,
    dateCreated: new Date(collection.createdAt).toLocaleDateString(),
    pmid: collection.pmid,
    owner: collection.owner,
    access: collection.access,
  })
);

export const getCollectionGenomeIds = createSelector(
  getGenomes,
  genomes => {
    const collectionGenomes = [];
    for (const id of Object.keys(genomes)) {
      if (genomes[id].__isCollection) {
        collectionGenomes.push(id);
      }
    }
    return collectionGenomes;
  }
);
