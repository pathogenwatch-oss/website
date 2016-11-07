import { createSelector } from 'reselect';

import { createColourGetter } from '../utils/resistanceProfile';

export const getAssemblies = createSelector(
  ({ entities }) => entities.assemblies,
  (assemblies) => Object.values(assemblies)
);

export const getVisibleAssemblyIds = createSelector(
  ({ filter }) => filter,
  (filter) => filter.unfilteredIds
);

export const getVisibleAssemblies = createSelector(
  ({ entities }) => entities.assemblies,
  getVisibleAssemblyIds,
  (assemblies, ids) => Array.from(ids).map(id => assemblies[id])
);

export const getFilteredAssemblyIds = createSelector(
  ({ filter }) => filter,
  (filter) => filter.ids
);

export const getColourGetter = createSelector(
  ({ tables }) => tables.resistanceProfile,
  resistanceProfile => createColourGetter(resistanceProfile.activeColumns)
);
