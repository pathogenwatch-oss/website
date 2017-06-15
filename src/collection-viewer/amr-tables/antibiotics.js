import React from 'react';

const { onHeaderClick } = require('./thunks');

import * as amr from '../amr-utils';
import { tableKeys } from '../constants';
import Organisms from '../../organisms';
import { getAntibioticLabel } from './utils';

const isMac =
  (navigator && navigator.platform &&
    navigator.platform.toUpperCase().indexOf('MAC') >= 0);
const modifierKey = isMac ? 'Cmd' : 'Ctrl';

function createColumn(antibiotic) {
  const columnKey = antibiotic.key;
  const hoverName = antibiotic.fullName || columnKey;

  return {
    columnKey,
    headerClasses: 'wgsa-table-header--expanded',
    headerTitle: `${hoverName ? `${hoverName} - ` : ''}${modifierKey} + click to select multiple`,
    cellClasses: 'wgsa-table-cell--resistance',
    cellPadding: 16,
    flexGrow: 0,
    label: getAntibioticLabel(antibiotic),
    getWidth() {
      return 32;
    },
    getCellContents(props, { analysis }) {
      if (!analysis.paarsnp) return null;

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
    valueGetter: genome => amr.getColour(columnKey, genome),
    onHeaderClick,
  };
}

export const name = tableKeys.antibiotics;

export function buildColumns({ antibiotics }) {
  const { hiddenColumns = new Set() } = Organisms.current.amrOptions || {};
  return (
    antibiotics
      .filter(({ key }) => !hiddenColumns.has(key))
      .map(createColumn)
  );
}
