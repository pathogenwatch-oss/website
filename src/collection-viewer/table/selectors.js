import { createSelector } from 'reselect';

import { getViewer } from '../../collection-route/selectors';

export const getTableState = state => getViewer(state).table;

export const getTables = state => getTableState(state).entities;

export const getMetadataTable = state => getTables(state).metadata;
export const getResistanceProfileTable = state => getTables(state).resistanceProfile;

export const getVisibleTableName = state => getTableState(state).visible;

export const getVisibleTable = createSelector(
  getTables,
  getVisibleTableName,
  (tables, name) => tables[name]
);
