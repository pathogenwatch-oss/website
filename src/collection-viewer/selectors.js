import { createSelector } from 'reselect';

import { getTables, getAMRTableName } from './table/selectors';

import { createColourGetter } from './amr-utils';

export const getViewer = ({ viewer }) => viewer;

export const getCollection = state => getViewer(state).entities.collection;

export const getGenomes = state => getViewer(state).entities.genomes;

export const getFilter = createSelector(
  state => getViewer(state).filter,
  state => getViewer(state).search.terms,
  (filter, terms) => {
    if (terms.size) {
      return {
        ...filter,
        ids: new Set(
          Array.from(terms)
            .reduce((memo, { value }) => memo.concat(value.ids), [])
        ),
        active: true,
      };
    }
    return filter;
  }
);

export const getVisibleGenomeIds = state => getFilter(state).unfilteredIds;

export const getGenomeList = createSelector(
  getGenomes,
  getVisibleGenomeIds,
  (genomes, ids) => Array.from(ids).map(id => genomes[id])
);

export const getFilteredGenomeIds = createSelector(
  getFilter,
  filter => filter.ids
);

export const getActiveGenomeIds = createSelector(
  getFilter,
  filter => Array.from(filter.active ? filter.ids : filter.unfilteredIds)
);

export const getActiveGenomes = createSelector(
  getGenomes,
  getActiveGenomeIds,
  (genomes, ids) => Array.from(ids).map(id => genomes[id])
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
