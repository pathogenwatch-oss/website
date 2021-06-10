import React from 'react';

import { FETCH_COLLECTION } from '../actions';
import { SET_COLOUR_COLUMNS } from '../table/actions';
import { onHeaderClick } from './thunks';

import * as amr from '../amr-utils';
import { measureHeadingText } from '../table/columnWidth';
import { spacerGroup, systemGroup } from './utils';

import { statuses, tableKeys } from '../constants';

export const name = tableKeys.vista;

function selectColour(status) {
  if (!status) {
    return amr.nonResistantColour;
  }
  if (status === 'Present') {
    return amr.getStateColour('RESISTANT');
  }
  if (status === 'Incomplete') {
    return amr.getStateColour('INTERMEDIATE');
  }
  return amr.nonResistantColour;
}

export function findCluster(clusterName, vistaField) {
  return vistaField.find(cluster => cluster.name === clusterName);
}

function hasCluster({ vista }, clusterName, field) {
  return vista && findCluster(clusterName, vista[field]).status !== 'Not found';
}

const isMac =
  (navigator && navigator.platform &&
    navigator.platform.toUpperCase().indexOf('MAC') >= 0);
const modifierKey = isMac ? 'Cmd' : 'Ctrl';

function buildColumnGroup(field, genomes) {
  const groupColumns = [];
  for (const record of genomes[0].analysis.vista[field]) {
    groupColumns.push({
      columnKey: `vista_${record.name}`,
      addState({ genomes }) {
        if (!genomes.length) return this;
        this.width = this.getWidth() + this.cellPadding;
        return this;
      },
      headerClasses: 'wgsa-table-header--expanded',
      headerTitle: `${record.name} (${record.type}) - ${modifierKey} + click to select multiple`,
      cellClasses: 'wgsa-table-cell--resistance',
      cellPadding: 16,
      // flexGrow: 0,
      // displayName: agent.name,
      label: record.name,
      getWidth() {
        const textWidth = measureHeadingText(record.name);
        return textWidth < 32 ? 48 : textWidth + 16;
      },
      getCellContents(props, { analysis }) {
        return hasCluster(analysis, record.name, field) ? (
          <i
            className="material-icons wgsa-resistance-icon"
            style={{ color: selectColour(findCluster(record.name, analysis.vista[field]).status) }}
            title={`${record.name} (${record.type})`}
          >
            lens
          </i>
        ) : null;
      },
      valueGetter: ( { analysis }) => {
        const value = findCluster(record.name, analysis.vista[field]);
        return !!value ? selectColour(value.status) : amr.nonResistantColour;
      },
      onHeaderClick,
    });
  }
  return groupColumns;
}

function buildColumns(genomes) {
  return buildColumnGroup('virulenceGenes', genomes)
    .concat(buildColumnGroup('virulenceClusters', genomes));
}

const initialState = {
  activeColumns: new Set(),
  columns: [],
};

export function createReducer() {
  return function (state = initialState, { type, payload }) {
    switch (type) {
      case FETCH_COLLECTION.SUCCESS: {
        const { genomes, status } = payload.result;
        if (status !== statuses.READY || !genomes[0].analysis.vista) return state;
        return {
          ...state,
          columns: [
            ...systemGroup.columns,
            ...buildColumns(genomes),
            ...spacerGroup.columns,
          ],
        };
      }
      case SET_COLOUR_COLUMNS:
        return {
          ...state,
          activeColumns:
            payload.table === name ?
              payload.columns :
              state.activeColumns,
        };
      default:
        return state;
    }
  };
}
