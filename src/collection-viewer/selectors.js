import { createSelector } from 'reselect';

import { getTables, getAMRTableName } from './table/selectors';

import { createColourGetter } from './amr-utils';
import { filterKeys } from './filter/constants';

export const getViewer = ({ viewer }) => viewer;

export const getCollection = state => getViewer(state).entities.collection;

export const getGenomes = state => getViewer(state).entities.genomes;

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
  (filter, searchTerms, searchIds) => {
    if (searchTerms.length) {
      return {
        ...filter,
        ids: new Set(searchIds),
        active: true,
      };
    }
    return filter;
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
  getTables,
  getAMRTableName,
  (tables, name) => createColourGetter(name, tables[name].activeColumns)
);

export const getCollectionMetadata = createSelector(
  getCollection,
  collection => ({
    title: collection.title,
    description: collection.description,
    dateCreated: new Date(collection.createdAt).toLocaleDateString(),
    pmid: collection.pmid,
  })
);
