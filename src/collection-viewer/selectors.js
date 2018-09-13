import { createSelector } from 'reselect';
import removeMarkdown from 'remove-markdown';

import { getTableState, getAMRTableName } from './table/selectors';
import {
  getNetworkHighlightedIds,
  getNetworkFilteredIds,
} from '../cluster-viewer/selectors';


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

export const getFilter = createSelector(
  state => getViewer(state).filter[filterKeys.VISIBILITY],
  state => getViewer(state).search.intersections,
  getSearchIds,
  getNetworkFilteredIds,
  (filter, searchTerms, searchIds, networkIds = []) => {
    if (searchTerms.length === 0 && networkIds.length === 0) {
      return filter;
    }

    const intersections = [];
    if (filter.active) {
      intersections.push(filter.ids);
    }
    if (searchTerms.length) {
      intersections.push(new Set(searchIds));
    }
    if (networkIds.length) {
      intersections.push(new Set(networkIds));
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
      ...filter,
      ids: new Set(ids),
      active: true,
    };
  }
);

export const getUnfilteredGenomeIds = state => getFilter(state).unfilteredIds;

export const getGenomeList = createSelector(
  getGenomes,
  getUnfilteredGenomeIds,
  (genomes, ids) => Array.from(ids).map(id => genomes[id])
);

export const getFilteredGenomeIds = createSelector(
  getFilterState,
  filter => filter[filterKeys.VISIBILITY].ids
);

export const getHighlightedIds = createSelector(
  getFilterState,
  getNetworkHighlightedIds,
  (filter, idsFromNetwork) => {
    const idsFromFilter = filter[filterKeys.HIGHLIGHT].ids;
    if (idsFromNetwork.length === 0) {
      return idsFromFilter;
    }
    return new Set([ ...idsFromFilter, ...idsFromNetwork ]);
  }
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
