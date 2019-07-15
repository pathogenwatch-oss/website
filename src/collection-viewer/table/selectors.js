import { createSelector } from 'reselect';

import { getViewer, getCollection, hasMetadata } from '../selectors';
import { getMetadataColumns, getActiveMetadataColumn } from '../data-tables/selectors';

import { createColourGetter } from '../amr-utils';
import Organisms from '~/organisms';

import { tableKeys } from '../constants';

export const getTableState = state => getViewer(state).table;
export const getDataTableName = state => getTableState(state).activeData;
export const getAMRTableName = state => getTableState(state).activeAMR;
export const getTableEntities = state => getTableState(state).entities;

const getMetadataTable = createSelector(
  getTableEntities,
  getMetadataColumns,
  getActiveMetadataColumn,
  hasMetadata,
  ({ metadata }, columns, activeColumn, active) => ({
    ...metadata,
    active,
    activeColumn,
    columns,
  })
);

export const getTables = createSelector(
  getTableEntities,
  getMetadataTable,
  (tables, metadata) => ({
    ...tables,
    metadata,
  }),
);

export const hasTyping = createSelector(
  getTables,
  tables => tables.typing.active
);

export const getVisibleTableName = createSelector(
  state => getTableState(state).visible,
  hasMetadata,
  hasTyping,
  (visible, metadata, typing) => {
    if (visible !== null) return visible;
    if (metadata) return tableKeys.metadata;
    if (typing) return tableKeys.typing;
    return tableKeys.stats;
  }
);


export const getVisibleTable = state => {
  const name = getVisibleTableName(state);
  return getTables(state)[name];
};

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

export const hasAMR = createSelector(
  // do not use `isClusterView` selector here, it will get stuck
  state => (getCollection ? getCollection(state) : {}),
  collection => !collection.isClusterView && !Organisms.uiOptions.noAMR
);

export const isAMRTable = createSelector(
  getVisibleTableName,
  getAMRTableName,
  (visible, amr) => visible === amr
);

export const getFixedGroupWidth = createSelector(
  hasAMR,
  hasMetadata,
  hasTyping,
  isAMRTable,
  (amr, metadata, typing, amrVisible) => {
    if (!amr) return null; // no need for fixed width without AMR tables
    let width = amrVisible ? 404 : 348; // acount for multi button
    if (!metadata) width -= 68;
    if (!typing) width -= 53;
    return width;
  }
);

export const getColourGetter = createSelector(
  getTableState,
  getAMRTableName,
  (tables, name) => createColourGetter(tables.entities[name], tables.multi)
);
