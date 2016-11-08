import { createSelector } from 'reselect';

import { createColourGetter } from '../utils/resistanceProfile';

export const getFilter = ({ collectionFilter }) => collectionFilter;

export const getAssemblies = createSelector(
  ({ entities }) => entities.assemblies,
  assemblies => Object.values(assemblies)
);

export const getVisibleAssemblyIds = createSelector(
  getFilter,
  filter => filter.unfilteredIds
);

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
  ({ tables }) => tables.resistanceProfile,
  resistanceProfile => createColourGetter(resistanceProfile.activeColumns)
);
