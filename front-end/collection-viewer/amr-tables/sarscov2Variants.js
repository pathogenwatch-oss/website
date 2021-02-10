import React from 'react';

import { FETCH_COLLECTION } from '../actions';
import { SET_COLOUR_COLUMNS } from '../table/actions';
import { onHeaderClick } from './thunks';

import * as amr from '../amr-utils';
import { measureHeadingText } from '../table/columnWidth';
import { spacerGroup, systemGroup } from './utils';
import Organism from '../../organisms';

import { statuses, tableKeys } from '../constants';

export const name = tableKeys.sarscov2Variants;

const effectColour = amr.getEffectColour('RESISTANT');

const isMac =
  (navigator && navigator.platform &&
    navigator.platform.toUpperCase().indexOf('MAC') >= 0);
const modifierKey = isMac ? 'Cmd' : 'Ctrl';

function hasVariant(name, analysis) {
  return analysis['sarscov2-variants'].variants.find(element => element.name === name).state === 'var'
}

function buildColumns(genomes) {
  const columns = [];
  // Need to gather into phenotypes
  Object.values(genomes)[0].analysis['sarscov2-variants'].variants
    .sort((a, b) => {
      if (a.type === b.type) {
        if (a.name < b.name) {
          return -1
        }
        return 1;
      } else if (a.type === 'Deletion' || a.type === 'SNP') {
        if (a.type === 'SNP') {
          return 1;
        } else if (b.type === 'SNP') {
          return -1;
        }
        return 1;
      }
      return -1;
    })
    .forEach((variant) => {
      columns.push({
        columnKey: `${variant.name}`,
        addState({ genomes }) {
          if (!genomes.length) return this;
          this.hidden = genomes.every(({ analysis }) =>
            !analysis['sarscov2-variants'] || !hasVariant(variant.name, analysis)
          );
          this.width = this.getWidth() + this.cellPadding;
          return this;
        },
        headerClasses: 'wgsa-table-header--expanded',
        headerTitle: `${variant.name} - ${modifierKey} + click to select multiple`,
        cellClasses: 'wgsa-table-cell--resistance',
        cellPadding: 16,
        // flexGrow: 0,
        // displayName: agent.name,
        label: variant.name,
        getWidth() {
          return measureHeadingText(variant.name);
        },
        getCellContents(props, { analysis }) {
          return hasVariant(variant.name, analysis) ? (
            <i
              className="material-icons wgsa-resistance-icon"
              style={{ color: effectColour }}
              title={variant.name}
            >
            lens
            </i>
          ) : null;
        },
        valueGetter: genome => (hasVariant(variant.name, genome.analysis) ?
          effectColour :
          amr.nonResistantColour),
        onHeaderClick,
      });
    });
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
        if (status !== statuses.READY || !Organism.uiOptions['sarscov2-variants']) return state;
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
