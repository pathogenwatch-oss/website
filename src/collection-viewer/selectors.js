import { createSelector } from 'reselect';

import { getTables, getAMRTableName } from './table/selectors';

import { createColourGetter } from '../utils/resistanceProfile';

export const getFilter = ({ collectionViewer }) => collectionViewer.filter;

export const getAssemblies = createSelector(
  ({ entities }) => entities.assemblies,
  assemblies => Object.values(assemblies)
);

export const getVisibleAssemblyIds = state => getFilter(state).unfilteredIds;

export const getVisibleAssemblies = createSelector(
  ({ entities }) => entities.assemblies,
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
  ({ entities }) => entities.assemblies,
  getActiveAssemblyIds,
  (assemblies, ids) => Array.from(ids).map(id => assemblies[id])
);

export const getColourGetter = createSelector(
  getTables,
  getAMRTableName,
  (tables, name) => createColourGetter(name, tables[name].activeColumns)
);
