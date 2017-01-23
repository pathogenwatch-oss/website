import React from 'react';

const { onHeaderClick } = require('./thunks');

import * as amr from '../amr-utils';
import { tableKeys } from '../table/constants';
import Species from '../../species';
import { checkCustomLabels } from './utils';

const isMac =
  (navigator && navigator.platform &&
    navigator.platform.toUpperCase().indexOf('MAC') >= 0);
const modifierKey = isMac ? 'Cmd' : 'Ctrl';

function createColumn({ key, fullName }) {
  const columnKey = key;
  const hoverName = checkCustomLabels(key) === key ? (fullName || key) : null;

  return {
    columnKey,
    getLabel: () => checkCustomLabels(key),
    headerClasses: 'wgsa-table-header--expanded',
    headerTitle: `${hoverName ? `${hoverName} - ` : ''}${modifierKey} + click to select multiple`,
    cellClasses: 'wgsa-table-cell--resistance',
    flexGrow: 0,
    getWidth() {
      return 32;
    },
    cellPadding: 16,
    getCellContents(props, { analysis }) {
      const { antibiotics } = analysis.paarsnp;
      const isResistant =
        amr.isResistant(analysis.paarsnp, props.columnKey);
      if (isResistant) {
        const { state } = antibiotics[props.columnKey];
        return (
          <i
            className={`material-icons wgsa-resistance-icon wgsa-amr--${state.toLowerCase()}`}
          >
            lens
          </i>
        );
      }
      return null;
    },
    valueGetter: genome => amr.getColour(key, genome),
    onHeaderClick,
  };
}

export const name = tableKeys.antibiotics;

export function buildColumns({ antibiotics }) {
  const { antibioticsSeparatorIndex } = Species.current.amrOptions || {};

  if (typeof antibioticsSeparatorIndex === 'undefined') {
    return antibiotics.map(createColumn);
  }

  return [
    ...antibiotics.slice(0, antibioticsSeparatorIndex).map(createColumn),
    { columnKey: '__group_spacer',
      getHeaderContent() {},
      fixedWidth: 40,
      flexGrow: 0,
      getCellContents() {},
      cellClasses: 'wgsa-table-cell--resistance',
    },
    ...antibiotics.slice(antibioticsSeparatorIndex).map(createColumn),
  ];
}
