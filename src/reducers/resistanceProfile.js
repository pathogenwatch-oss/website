import React from 'react';

import { FETCH_ENTITIES } from '../actions/fetch';
import { SET_COLOUR_COLUMNS } from '../actions/table';

import Species from '../species';

import * as resistanceProfile from '../utils/resistanceProfile';

import { downloadColumnProps, nameColumnProps } from '../constants/table';

const systemColumnProps = [
  downloadColumnProps,
  { ...nameColumnProps,
    flexGrow: 0,
    headerClasses: 'wgsa-table-header--unstyled',
    onHeaderClick: () => {},
  },
];

const isMac =
  (navigator && navigator.platform &&
    navigator.platform.toUpperCase().indexOf('MAC') >= 0);
const modifierKey = isMac ? 'Cmd' : 'Ctrl';

function createAntibioticsColumn({ name, longName }) {
  const columnKey = longName ? name : name.slice(0, 3);
  const hoverName = longName || name;

  return {
    columnKey,
    headerClasses: 'wgsa-table-header--resistance',
    headerTitle: `${hoverName} - ${modifierKey} + click to select multiple`,
    cellClasses: 'wgsa-table-cell--resistance',
    fixedWidth: 40,
    flexGrow: 0,
    getCellContents(props, { analysis = {} }) {
      const isResistant = resistanceProfile.isResistant(analysis.resistanceProfile, props.columnKey);
      if (isResistant) {
        return (
          <i className="material-icons wgsa-resistance-icon wgsa-resistance-icon--resistant">
            check_circle
          </i>
        );
      }
      return null;
    },
    valueGetter: (assembly) => resistanceProfile.getColour(name, assembly),
    onHeaderClick: resistanceProfile.onHeaderClick,
  };
}

function buildAntibioticColumnProps(antibiotics) {
  const separatorIndex = Species.current.resistanceProfileSeparatorIndex;

  if (typeof separatorIndex === 'undefined') {
    return antibiotics.map(createAntibioticsColumn);
  }

  return [
    ...antibiotics.slice(0, separatorIndex).map(createAntibioticsColumn),
    { columnKey: '__group_spacer',
      getHeaderContent() {},
      fixedWidth: 40,
      flexGrow: 0,
      getCellContents() {},
      cellClasses: 'wgsa-table-cell--resistance',
    },
    ...antibiotics.slice(separatorIndex).map(createAntibioticsColumn),
  ];
}

const actions = {
  [FETCH_ENTITIES.SUCCESS](state, payload) {
    const antibiotics = payload[2];

    const columns = [
      { columnKey: '__spacer_l',
        getHeaderContent() {},
        fixed: true,
        fixedWidth: 1,
        getCellContents() {},
      },
      ...systemColumnProps,
      ...buildAntibioticColumnProps(antibiotics),
      { columnKey: '__spacer_r',
        getHeaderContent() {},
        fixedWidth: 1,
        getCellContents() {},
        cellClasses: 'wgsa-table-cell--resistance',
      },
    ];

    return { ...state, columns };
  },
  [SET_COLOUR_COLUMNS](state, { columns }) {
    return {
      ...state,
      activeColumns: columns,
    };
  },
};

const initialState = {
  activeColumns: new Set(),
  columns: [],
};

export default { actions, initialState };
