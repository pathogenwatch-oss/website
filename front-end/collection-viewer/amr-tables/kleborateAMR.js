import React from 'react';

import { FETCH_COLLECTION } from '../actions';
import { SET_COLOUR_COLUMNS } from '../table/actions';
import { onHeaderClick } from './thunks';

import * as amr from '../amr-utils';
import { kleborateIsResistant, kleborateMatches } from '../amr-utils';
import { measureHeadingText } from '../table/columnWidth';
import { spacerGroup, systemGroup } from './utils';

import { statuses, tableKeys } from '../constants';
import { displayAMRField, formatAMRMatch, formatAMRName, sortKleborateProfile } from '~/task-utils/kleborate';

export const name = tableKeys.kleborateAMR;

const effectColour = amr.getStateColour('RESISTANT');

const isMac =
  (navigator && navigator.platform &&
    navigator.platform.toUpperCase().indexOf('MAC') >= 0);
const modifierKey = isMac ? 'Cmd' : 'Ctrl';

function buildColumns(genomeRecords) {
  const columns = [];

  // Need to gather into phenotypes
  const headerRecords = Object.values(genomeRecords[0].analysis.kleborate.amr.profile).sort(sortKleborateProfile());
  for (const record of headerRecords) {
    if (!displayAMRField(record)) continue;
    columns.push({
      columnKey: `kleborate_${record.key}`,
      addState({ genomes }) {
        if (!genomes.length) return this;
        this.width = this.getWidth() + this.cellPadding;
        return this;
      },
      headerClasses: 'wgsa-table-header--expanded',
      headerTitle: `${formatAMRName(record)} - ${modifierKey} + click to select multiple`,
      cellClasses: 'wgsa-table-cell--resistance',
      cellPadding: 16,
      label: formatAMRName(record),
      getWidth() {
        return measureHeadingText(formatAMRName(record));
      },
      getCellContents(props, { analysis: { kleborate } }) {
        return kleborateIsResistant(kleborate, record.key) ? (
          <i
            className="material-icons wgsa-resistance-icon"
            style={{ color: effectColour }}
            title={formatAMRMatch({ matches: kleborateMatches(record, kleborate) })}
              >
              lens
              </i>
        ) : null;
      },
      valueGetter: genome => (kleborateIsResistant(genome.analysis.kleborate, record.key) ? effectColour : amr.nonResistantColour),
      onHeaderClick,
    });
  }
  return columns;
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
        if (status !== statuses.READY || !genomes[0].analysis.kleborate || !genomes[0].analysis.kleborate.amr) return state;
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
