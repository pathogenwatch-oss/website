import React from 'react';
import * as amr from '../amr-utils';
import { tableKeys } from '../constants';
import { measureHeadingText } from '../table/columnWidth';
import { modifierKey } from '~/collection-viewer/amr-tables/utils';
import { formatEffect } from '../amr-utils';

const { onHeaderClick } = require('./thunks');

function createColumn( { agent } ) {
  const columnKey = agent.key;

  return {
    columnKey,
    headerClasses: 'wgsa-table-header--expanded',
    headerTitle: `${modifierKey} + click to select multiple`,
    cellClasses: 'wgsa-table-cell--resistance',
    cellPadding: 16,
    flexGrow: 0,
    label: agent.key,
    addState() {
      this.width = this.getWidth();
      return this;
    },
    getWidth() {
      const textWidth = measureHeadingText(agent.name);
      return textWidth < 32 ? 48 : textWidth + 16;
    },
    getCellContents(props, { analysis }) {
      if (!analysis.paarsnp) return null;
      const state = amr.findState(analysis.paarsnp, props.columnKey);

      if (amr.hasResistanceState(state)) {
        return (
          <i
            className={`material-icons wgsa-resistance-icon wgsa-amr--${state.toLowerCase()}`}
            style={{ color: amr.getStateColour(state) }}
            title={ formatEffect(state) }
          >
            lens
          </i>
        );
      }
      return null;
    },
    valueGetter: genome => amr.getColour(columnKey, genome),
    onHeaderClick,
  };
}

export const name = tableKeys.antibiotics;

export function buildColumns(results) {
  return results[0].resistanceProfile.map(createColumn);
}
