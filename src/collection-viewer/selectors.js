import { createSelector } from 'reselect';

import { getGenomes, getViewer } from '../collection-route/selectors';
import { getTables, getAMRTableName } from './table/selectors';

import { createColourGetter } from './amr-utils';

export const getFilter = state => getViewer(state).filter;

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
