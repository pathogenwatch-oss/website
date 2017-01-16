import React from 'react';

import * as resistanceProfile from '../../utils/resistanceProfile';
import { tableKeys } from '../../collection-viewer/table/constants';
import Species from '../../species';

const isMac =
  (navigator && navigator.platform &&
    navigator.platform.toUpperCase().indexOf('MAC') >= 0);
const modifierKey = isMac ? 'Cmd' : 'Ctrl';

function createColumn({ key, fullName }) {
  const columnKey = key;
  const hoverName = fullName || key;
  const { customLabels } = Species.current.amrOptions;
  return {
    columnKey,
    getLabel() {
      return (key in customLabels ? customLabels[key] : key.slice(0, 3));
    },
    headerClasses: 'wgsa-table-header--expanded',
    headerTitle: `${hoverName} - ${modifierKey} + click to select multiple`,
    cellClasses: 'wgsa-table-cell--resistance',
    flexGrow: 0,
    getWidth() {
      return 32;
    },
    cellPadding: 16,
    getCellContents(props, { analysis }) {
      const { antibiotics } = analysis.resistanceProfile;
      const isResistant =
        resistanceProfile.isResistant(analysis.resistanceProfile, props.columnKey);
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
    valueGetter: assembly => resistanceProfile.getColour(key, assembly),
    onHeaderClick: resistanceProfile.onHeaderClick,
  };
}

export const name = tableKeys.antibiotics;

export function buildColumns({ antibiotics }) {
  const { antibioticsSeparatorIndex } = Species.current.amrOptions;

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
