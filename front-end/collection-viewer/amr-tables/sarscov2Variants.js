import React from 'react';

import { FETCH_COLLECTION } from '../actions';
import { SET_COLOUR_COLUMNS } from '../table/actions';
import { onHeaderClick } from './thunks';

import * as amr from '../amr-utils';
import { measureHeadingText } from '../table/columnWidth';
import { spacerGroup, systemGroup } from './utils';

import { statuses, tableKeys } from '../constants';

export const name = tableKeys.sarscov2Variants;

const variantPresentColour = amr.getEffectColour('RESISTANT');
const alternativePresentColour = amr.getEffectColour('INTERMEDIATE');

const isMac =
  (navigator && navigator.platform &&
    navigator.platform.toUpperCase().indexOf('MAC') >= 0);
const modifierKey = isMac ? 'Cmd' : 'Ctrl';

function hasVariant(record) {
  return record.state !== 'ref' && record.state !== 'sequence error';
}

function findVariant(name, analysis) {
  return analysis['sarscov2-variants'].variants.find(variant => variant.name === name);
}

function selectColour({ name, state }) {
  if (state === 'ref'||  state === 'sequence error' ) {
    return amr.nonResistantColour;
  } else if (state === 'var') {
    return variantPresentColour;
  }
  return name.endsWith('*') ? variantPresentColour : alternativePresentColour;
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
          this.hidden = genomes.every(({ analysis }) => !analysis['sarscov2-variants'] || findVariant(variant.name, analysis).state === 'ref');
          this.width = this.getWidth() + this.cellPadding;
          return this;
        },
        headerClasses: 'wgsa-table-header--expanded',
        headerTitle: `${variant.name} - ${modifierKey} + click to select multiple`,
        cellClasses: 'wgsa-table-cell--resistance',
        cellPadding: 16,
        label: variant.name,
        getWidth() {
          return measureHeadingText(variant.name);
        },
        getCellContents(props, { analysis }) {
          const record = findVariant(variant.name, analysis);
          return hasVariant(record) ? (
            <i
              className="material-icons wgsa-resistance-icon"
              style={{ color: selectColour(record) }}
              title={variant.name}
            >
            lens
            </i>
          ) : (record.state === 'sequence error' ? (
            <i
              className="material-icons wgsa-resistance-icon"
              title={variant.name}
            >
            help_outline
            </i>
          ) : null);
        },
        valueGetter: genome => (selectColour(findVariant(variant.name, genome.analysis))),
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
        const hasResult = !!genomes[0].analysis['sarscov2-variants'];
        if (status !== statuses.READY || !hasResult) return state;
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
