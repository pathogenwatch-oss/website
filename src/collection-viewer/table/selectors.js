import { createSelector } from 'reselect';

import { getViewer } from '../../collection-viewer/selectors';

export const getTableState = state => getViewer(state).table;

export const getTables = state => getTableState(state).entities;

export const getVisibleTableName = state => getTableState(state).visible;
export const getDataTableName = state => getTableState(state).activeData;
export const getAMRTableName = state => getTableState(state).activeAMR;

export const getVisibleTable = createSelector(
  getTables,
  getVisibleTableName,
  (tables, name) => tables[name]
);

export const getActiveDataTable = createSelector(
  getTables,
  getDataTableName,
  (tables, name) => tables[name]
);

export const getActiveAMRTable = createSelector(
  getTables,
  getAMRTableName,
  (tables, name) => tables[name]
);

export const hasMetadata = createSelector(
  getTables,
  tables => tables.metadata.active
);

export const hasTyping = createSelector(
  getTables,
  tables => tables.typing.active
);

export const isAMRTable = createSelector(
  getVisibleTableName,
  getAMRTableName,
  (visible, amr) => visible === amr
);

export const getFixedGroupWidth = createSelector(
  hasMetadata,
  hasTyping,
  isAMRTable,
  (metadata, typing, isAMR) => {
    let width = isAMR ? 404 : 348; // acount for multi button
    if (!metadata) width -= 68;
    if (!typing) width -= 53;
    return width;
  }
);
