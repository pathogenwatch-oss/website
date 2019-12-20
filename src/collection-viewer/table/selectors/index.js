import { createSelector } from 'reselect';

import { getViewer } from '../../selectors';
import {
  getGenomeList,
  hasMetadata,
  hasAMR,
  hasKleborateAMR,
} from '../../genomes/selectors';

import {
  getColumnNames,
  getLeadingSystemColumnProps,
  getTrailingSystemColumnProps,
  getUserDefinedColumnProps,
} from '../../data-tables/utils';

import { nameColumnProps } from '../constants';
import { tableKeys } from '../../constants';
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
  })
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
  state => !hasMetadata(state),
  (visible, initial, noMetadata) => {
    if (visible === null) return initial;
    if (visible === tableKeys.metadata && noMetadata) return initial;
    return visible;
  }
);

export const getDataTableName = createSelector(
  state => getTableState(state).activeData,
  getInitialTable,
  state => !hasMetadata(state),
  (active, initial, noMetadata) => {
    if (active === null) return initial;
    if (active === tableKeys.metadata && noMetadata) return initial;
    return active;
  }
);

export const getVisibleTable = state => {
  const name = getVisibleTableName(state);
  return getTables(state)[name];
};

export const getActiveColumns = createSelector(
  getVisibleTable,
  ({ activeColumn, activeColumns }) => (
    new Set(
      activeColumn ?
        [ activeColumn.columnKey ] :
        Array.from(activeColumns)
          .filter(_ => _) // columns are sometimes undefined, not sure why
          .map(_ => _.columnKey),
    )
  ),
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

export const isAMRTable = createSelector(
  getVisibleTableName,
  getAMRTableName,
  (visible, amr) => visible === amr
);

export const getFixedGroupWidth = createSelector(
  hasAMR,
  isAMRTable,
  hasKleborateAMR,
  (amr, amrVisible, kleborate) => {
    if (!amr && !kleborate) return null;
    let width = kleborate ? 152 : 104;
    if (amrVisible) width += 48; // account for multi button
    return width;
  }
);
