import { createSelector } from 'reselect';
import removeMarkdown from 'remove-markdown';

import { getNetworkFilteredIds } from '../cluster-viewer/selectors';
import { getPrivateMetadata } from './private-metadata/selectors';

import { filterKeys } from './filter/constants';

export const getViewer = ({ viewer }) => viewer;

export const getCollection = state => getViewer(state).entities.collection;
export const isClusterView = state => getCollection(state).isClusterView;
export const getGenomes = createSelector(
  state => getViewer(state).entities.genomes,
  getPrivateMetadata,
  (genomes, privateData) => {
    const merged = { ...genomes };
    const used = new Set();
    for (const [ key, shared ] of Object.entries(genomes)) {
      if (!(shared.name in privateData) || used.has(shared.name)) continue;
      const { userDefined, ...topLevel } = privateData[shared.name];
      merged[key] = {
        ...shared,
        ...topLevel,
        userDefined: {
          ...shared.userDefined,
          ...userDefined,
        },
      };
    }
    return merged;
  }
);

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

export const getGenomeList = createSelector(
  getGenomes,
  getUnfilteredGenomeIds,
  (genomes, ids) => Array.from(ids).map(id => genomes[id])
);

const getHighlightState = state => getViewer(state).highlight;

export const getHighlightedIds = createSelector(
  getHighlightState,
  highlight => highlight.ids
);

export const hasHighlightedIds = createSelector(
  getHighlightedIds,
  ids => ids.size > 0
);

export const getFilteredGenomeIds = createSelector(
  getFilter,
  filter => Array.from(filter.active ? filter.ids : filter.unfilteredIds)
);

export const getActiveGenomeIds = createSelector(
  getHighlightedIds,
  getFilteredGenomeIds,
  (highlighted, visible) => Array.from(highlighted.size ? highlighted : visible)
);

export const getActiveGenomes = createSelector(
  getGenomes,
  getActiveGenomeIds,
  (genomes, ids) => ids.map(id => genomes[id])
);

export const getCollectionMetadata = createSelector(
  getCollection,
  collection => ({
    title: collection.title,
    description: collection.description,
    dateCreated: new Date(collection.createdAt),
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

export const hasMetadata = createSelector(
  getGenomeList,
  genomes =>
    genomes.some(({ year, pmid, userDefined }) => !!(
      year ||
      pmid ||
      (userDefined && Object.keys(userDefined).length)
    ))
);

export const getOwnGenomes = createSelector(
  getActiveGenomes,
  genomes => genomes.filter(_ => _.owner === 'me')
);
