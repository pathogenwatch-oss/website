import { createSelector } from 'reselect';

import { getAssemblies, getViewer } from '../collection-route/selectors';
import { getTables, getAMRTableName } from './table/selectors';

import { createColourGetter } from './amr-utils';

export const getFilter = state => getViewer(state).filter;

export const getVisibleAssemblyIds = state => getFilter(state).unfilteredIds;

export const getVisibleAssemblies = createSelector(
  getAssemblies,
  getVisibleAssemblyIds,
  (assemblies, ids) => Array.from(ids).map(id => assemblies[id])
);

export const getFilteredAssemblyIds = createSelector(
  getFilter,
  filter => filter.ids
);

export const getActiveAssemblyIds = createSelector(
  getFilter,
  filter => Array.from(filter.active ? filter.ids : filter.unfilteredIds)
);

export const getActiveAssemblies = createSelector(
  getAssemblies,
  getActiveAssemblyIds,
  (assemblies, ids) => Array.from(ids).map(id => assemblies[id])
);

export const getColourGetter = createSelector(
  getTables,
  getAMRTableName,
  (tables, name) => createColourGetter(name, tables[name].activeColumns)
);
