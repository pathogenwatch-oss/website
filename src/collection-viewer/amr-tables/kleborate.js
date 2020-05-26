import React from 'react';

import { FETCH_COLLECTION } from '../actions';
import { SET_COLOUR_COLUMNS } from '../table/actions';
import { onHeaderClick } from './thunks';

import * as amr from '../amr-utils';
import { measureHeadingText } from '../table/columnWidth';
import { systemGroup, spacerGroup } from './utils';
import Organism from '../../organisms';

import { statuses } from '../constants';
import { tableKeys } from '../constants';

export const name = tableKeys.kleborateAMR;

function hasElement(genome, field) {
  return (
    genome.analysis.kleborate &&
    genome.analysis.kleborate.amr[field] &&
    genome.analysis.kleborate.amr[field].match &&
    genome.analysis.kleborate.amr[field].match !== '-'
  );
}

const effectColour = amr.getEffectColour('RESISTANT');

const isMac =
  (navigator && navigator.platform &&
    navigator.platform.toUpperCase().indexOf('MAC') >= 0);
const modifierKey = isMac ? 'Cmd' : 'Ctrl';

function buildColumns(genomes) {
  const columns = [];
  for (const record of Object.values(genomes[0].analysis.kleborate.amr)) {
    columns.push({
      columnKey: `kleborate_${record.key}`,
      addState({ genomes }) {
        if (!genomes.length) return this;
        // this.hidden = data.every(({ analysis }) =>
        //   !analysis.paarsnp || notPresent(analysis.paarsnp[profileKey], key)
        // );
        this.width = this.getWidth() + this.cellPadding;
        return this;
      },
      headerClasses: 'wgsa-table-header--expanded',
      headerTitle: `${record.name} - ${modifierKey} + click to select multiple`,
      cellClasses: 'wgsa-table-cell--resistance',
      cellPadding: 16,
      // flexGrow: 0,
      // displayName: agent.name,
      label: record.name,
      getWidth() {
        return measureHeadingText(record.name);
      },
      getCellContents(props, genome) {
        return hasElement(genome, record.key) ? (
          <i
            className="material-icons wgsa-resistance-icon"
            style={{ color: effectColour }}
            title={genome.analysis.kleborate.amr[record.key]}
          >
            lens
          </i>
        ) : null;
      },
      valueGetter: genome => (hasElement(genome, record.key) ? effectColour : amr.nonResistantColour),
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
        const { genomes, status, isClusterView } = payload.result;
        if (status !== statuses.READY || isClusterView || !Organism.uiOptions.kleborate) return state;
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
