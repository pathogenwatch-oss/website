import React from 'react';

import { FETCH_COLLECTION } from '../actions';
import { SET_COLOUR_COLUMNS } from '../table/actions';
import { onHeaderClick } from './thunks';

import * as amr from '../amr-utils';
import { measureText } from '../table/columnWidth';
import { systemGroup, spacerGroup } from './utils';
import Organism from '~/organisms';

import { statuses } from '../constants';
import { tableKeys } from '../constants';

export const name = tableKeys.kleborateAMR;

const agents = [
  { field: 'AGly', name: 'Aminoglycosides', key: 'AGS', type: 'Aminoglycosides' },
  { field: 'Col', name: 'Colistin', key: 'CST', type: 'Colistin' },
  { field: 'Fcyn', name: 'Fosfomycin', key: 'FOF', type: 'Phosphonic Acid' },
  { field: 'Flq', name: 'Fluoroquinolones', key: 'FLQ', type: 'Fluoroquinolones' },
  { field: 'Gly', name: 'Glycopeptides', key: 'GPA', type: 'Glycopeptides' },
  { field: 'MLS', name: 'Macrolides', key: 'MAC', type: 'Macrolides' },
  { field: 'Ntmdz', name: 'Nitroimidazoles', key: 'NIM', type: 'Nitroimidazoles' },
  { field: 'Phe', name: 'Phenicols', key: 'PHE', type: 'Phenicols' },
  { field: 'Rif', name: 'Rifampicin', key: 'RIF', type: 'Rifamycin' },
  { field: 'Sul', name: 'Sulfonamides', key: 'SMX', type: 'Sulfonamides' },
  { field: 'Tet', name: 'Tetracycline', key: 'TCY', type: 'Tetracyclines' },
  { field: 'Tmt', name: 'Trimethoprim', key: 'TMP', type: 'Diaminopyrimidine' },
  { field: 'Bla', name: 'Beta-lactams', key: 'BLA', type: 'Beta-Lactams' },
  { field: 'Bla_Carb', name: 'Carbapenems', key: 'CBP', type: 'Carbapenems' },
  { field: 'Bla_ESBL', name: 'ESBLs', key: 'EBL', type: 'Extended Spectrum Beta-Lactams' },
  { field: 'Bla_ESBL_inhR', name: 'ESBL Inhibitors', key: 'EBI', type: 'ESBL Inhibitors' },
  { field: 'Bla_broad', name: 'Broad-Spectrum Cephalosporins', key: 'CEP', type: 'Broad-Spectrum Cephalosporins' },
  { field: 'Bla_broad_inhR', name: 'BSBL Inhibitors', key: 'BBI', type: 'Broad-Spectrum Beta-Lactam Inhibitors' },
];

function hasElement(genome, field) {
  return (
    genome.analysis.kleborate &&
    genome.analysis.kleborate[field] &&
    genome.analysis.kleborate[field] !== '-'
  );
}

const effectColour = amr.getEffectColour('RESISTANT');

const isMac =
  (navigator && navigator.platform &&
    navigator.platform.toUpperCase().indexOf('MAC') >= 0);
const modifierKey = isMac ? 'Cmd' : 'Ctrl';

function buildColumns() {
  const columns = [];
  for (const agent of agents) {
    columns.push({
      columnKey: `kleborate_${agent.field}`,
      addState({ genomes }) {
        if (!genomes.length) return this;
        // this.hidden = data.every(({ analysis }) =>
        //   !analysis.paarsnp || notPresent(analysis.paarsnp[profileKey], key)
        // );
        this.width = this.getWidth() + 16;
        return this;
      },
      headerClasses: 'wgsa-table-header--expanded',
      headerTitle: `${agent.name} - ${modifierKey} + click to select multiple`,
      cellClasses: 'wgsa-table-cell--resistance',
      cellPadding: 16,
      // flexGrow: 0,
      // displayName: agent.name,
      label: agent.field,
      getWidth() {
        return measureText(agent.field, true);
      },
      getCellContents(props, genome) {
        return hasElement(genome, agent.field) ? (
          <i
            className="material-icons wgsa-resistance-icon"
            style={{ color: effectColour }}
            title={genome.analysis.kleborate[agent.field]}
          >
            lens
          </i>
        ) : null;
      },
      valueGetter: genome => (hasElement(genome, agent.field) ? effectColour : amr.nonResistantColour),
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
