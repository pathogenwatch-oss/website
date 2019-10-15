import React from 'react';

import { FETCH_COLLECTION } from '../../collection-viewer/actions';
import { SET_COLOUR_COLUMNS } from '../table/actions';
import { onHeaderClick } from './thunks';

import * as amr from '../amr-utils';
import { measureText } from '../table/columnWidth';
import { systemGroup, spacerGroup } from './utils';
import Organism from '~/organisms';

import { statuses } from '../../collection-viewer/constants';
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

function hasElement(genome, field, value) {
  return (
    genome.analysis.kleborate &&
    genome.analysis.kleborate[field] &&
    genome.analysis.kleborate[field].includes(value)
  );
}

const effectColour = amr.getEffectColour('RESISTANT');

function createColumn(value, agent) {
  const { field } = agent;
  return {
    addState({ data }) {
      if (!data.length) return this;
      // this.hidden = data.every(({ analysis }) =>
      //   !analysis.paarsnp || notPresent(analysis.paarsnp[profileKey], key)
      // );
      this.width = this.getWidth() + 16;
      return this;
    },
    columnKey: `${field}_${value}`,
    displayName: value,
    label: value,
    cellClasses: 'wgsa-table-cell--resistance',
    cellPadding: 16,
    flexGrow: 0,
    getWidth() {
      return measureText(value, true) + 4;
    },
    getCellContents(props, genome) {
      return hasElement(genome, agent.field, value) ? (
        <i
          className="material-icons wgsa-resistance-icon"
          style={{ color: effectColour }}
        >
          lens
        </i>
      ) : null;
    },
    headerClasses: 'wgsa-table-header--expanded',
    valueGetter: genome => (hasElement(genome, field, value) ? effectColour : amr.nonResistantColour),
    onHeaderClick,
  };
}

function buildColumns(genomes) {
  const values = {};
  for (const genome of genomes) {
    if (!genome.analysis.kleborate) continue;
    for (const agent of agents) {
      const valuesSet = values[agent.field] || new Set();
      for (const value of genome.analysis.kleborate[agent.field].split(';')) {
        if (value !== '-') valuesSet.add(value.replace(/(\*|\?)/g, ''));
      }
      values[agent.field] = valuesSet;
    }
  }

  const groups = [];
  for (const agent of agents) {
    if (!(agent.field in values)) continue;
    groups.push({
      group: true,
      columnKey: `kleborate_${agent.key}`,
      label: agent.name,
      headerClasses: 'wgsa-table-header--expanded',
      headerTitle: agent.type,
      onHeaderClick,
      columns:
        Array.from(values[agent.field])
          .sort()
          .map(value => createColumn(value, agent)),
    });
  }

  return groups;
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
        const columns = buildColumns(genomes);
        return {
          ...state,
          columns: [ systemGroup, ...columns, spacerGroup ],
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
