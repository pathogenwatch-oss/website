import React from 'react';

import { FETCH_COLLECTION } from '../actions';
import { SET_COLOUR_COLUMNS } from '../table/actions';
import { onHeaderClick } from './thunks';

import * as amr from '../amr-utils';
import { measureHeadingText } from '../table/columnWidth';
import { systemGroup, spacerGroup } from './utils';
import Organism from '~/organisms';

import { statuses } from '../constants';
import { tableKeys } from '../constants';

export const name = tableKeys.vista;

function hasElement(genome, geneName) {
  return genome.analysis.vista &&
    genome.analysis.vista.virulenceGenes
      .find(gene => gene.name === geneName && gene.status === 'Present');
}

function hasCluster(genome, clusterName) {
  return genome.analysis.vista &&
    genome.analysis.vista.virulenceClusters
      .find(cluster => cluster.name === clusterName && cluster.complete);
}

const effectColour = amr.getEffectColour('RESISTANT');

const isMac =
  (navigator && navigator.platform &&
    navigator.platform.toUpperCase().indexOf('MAC') >= 0);
const modifierKey = isMac ? 'Cmd' : 'Ctrl';

function buildColumns(genomes) {
  const columns = [];
  for (const gene of genomes[0].analysis.vista.virulenceGenes) {
    columns.push({
      columnKey: `vista_${gene.name}`,
      addState({ genomes }) {
        if (!genomes.length) return this;
        this.width = this.getWidth() + this.cellPadding;
        return this;
      },
      headerClasses: 'wgsa-table-header--expanded',
      headerTitle: `${gene.name} (${gene.type}) - ${modifierKey} + click to select multiple`,
      cellClasses: 'wgsa-table-cell--resistance',
      cellPadding: 16,
      // flexGrow: 0,
      // displayName: agent.name,
      label: gene.name,
      getWidth() {
        return measureHeadingText(gene.name);
      },
      getCellContents(props, genome) {
        return hasElement(genome, gene.name) ? (
          <i
            className="material-icons wgsa-resistance-icon"
            style={{ color: effectColour }}
            title={`${gene.name} (${gene.type})`}
          >
            lens
          </i>
        ) : null;
      },
      valueGetter: genome => (hasElement(genome, gene.name) ? effectColour : amr.nonResistantColour),
      onHeaderClick,
    });
  }

  for (const cluster of genomes[0].analysis.vista.virulenceClusters) {
    columns.push({
      columnKey: `vista_${cluster.name}`,
      addState({ genomes }) {
        if (!genomes.length) return this;
        this.width = this.getWidth() + this.cellPadding;
        return this;
      },
      headerClasses: 'wgsa-table-header--expanded',
      headerTitle: `${cluster.name} (${cluster.type}) - ${modifierKey} + click to select multiple`,
      cellClasses: 'wgsa-table-cell--resistance',
      cellPadding: 16,
      label: cluster.name,
      getWidth() {
        return measureHeadingText(cluster.name);
      },
      getCellContents(props, genome) {
        return hasCluster(genome, cluster.name) ? (
          <i
            className="material-icons wgsa-resistance-icon"
            style={{ color: effectColour }}
            title={`${cluster.name} (${cluster.type})`}
          >
            lens
          </i>
        ) : null;
      },
      valueGetter: genome => (hasCluster(genome, cluster.name) ? effectColour : amr.nonResistantColour),
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
        if (status !== statuses.READY || isClusterView || !Organism.uiOptions.vista) return state;
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
