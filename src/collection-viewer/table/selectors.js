import { createSelector } from 'reselect';

import { getViewer, getCollection } from '../selectors';
import { getGenomeList, hasMetadata } from '../genomes/selectors';

import Organisms from '~/organisms';
import {
  getColumnNames,
  getLeadingSystemColumnProps,
  getTrailingSystemColumnProps,
  getUserDefinedColumnProps,
} from '../data-tables/utils';

import { nameColumnProps } from './constants';
import { tableKeys } from '../constants';

export const getTableState = state => getViewer(state).table;
export const getAMRTableName = state => getTableState(state).activeAMR;
export const getTableEntities = state => getTableState(state).entities;

export const getMetadataColumns = createSelector(
  getGenomeList,
  (genomes) => {
    const { leading, trailing, userDefined } = getColumnNames(genomes);
    const leadingSystemColumnProps = getLeadingSystemColumnProps(leading);
    const trailingSystemColumnProps = getTrailingSystemColumnProps(trailing);
    return [
      ...leadingSystemColumnProps,
      ...getUserDefinedColumnProps(userDefined),
      ...trailingSystemColumnProps,
    ];
  }
);

export const getActiveMetadataColumn = createSelector(
  getMetadataColumns,
  state => getTableEntities(state).metadata.activeColumn,
  (columns, activeColumn) => {
    for (const column of columns) {
      if (column.columnKey === activeColumn.columnKey) {
        return activeColumn;
      }
    }
    return nameColumnProps;
  }
);

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

const getInitialTable = createSelector(
  hasMetadata,
  hasTyping,
  (metadata, typing) => {
    if (metadata) return tableKeys.metadata;
    if (typing) return tableKeys.typing;
    return tableKeys.stats;
  }
);

export const getVisibleTableName = createSelector(
  state => getTableState(state).visible,
  getInitialTable,
  hasTyping,
  (visible, initial) => {
    if (visible !== null) return visible;
    return initial;
  }
);

export const getDataTableName = createSelector(
  state => getTableState(state).activeData,
  getInitialTable,
  (active, initial) => {
    if (active !== null) return active;
    return initial;
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
