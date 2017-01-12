import { createSelector } from 'reselect';

import { getViewer } from '../../collection-route/selectors';

export const getTableState = state => getViewer(state).table;

export const getTables = state => getTableState(state).entities;

export const getMetadataTable = state => getTables(state).metadata;

export const getVisibleTableName = state => getTableState(state).visible;
export const getAMRTableName = state => getTableState(state).activeAMR;

export const getVisibleTable = createSelector(
  getTables,
  getVisibleTableName,
  (tables, name) => tables[name]
);

export const getActiveAMRTable = createSelector(
  getTables,
  getAMRTableName,
  (tables, name) => tables[name]
);
