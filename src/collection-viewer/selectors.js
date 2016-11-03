import { createSelector } from 'reselect';

import { createColourGetter } from '../utils/resistanceProfile';

export const getVisibleAssemblies = createSelector(
  ({ entities }) => entities.assemblies,
  ({ filter }) => filter,
  (assemblies, filter) =>
    Array.from(
      filter.active ? filter.ids : filter.unfilteredIds
    ).map(id => assemblies[id])
);

export const getColourGetter = createSelector(
  ({ tables }) => tables.resistanceProfile,
  resistanceProfile => createColourGetter(resistanceProfile.activeColumns)
);
