import React from 'react';

import { FETCH_ENTITIES } from '../actions/fetch';
import { SET_COLOUR_COLUMNS } from '../actions/table';

import {
  getColour,
  measureText,
  onHeaderClick,
} from '../utils/resistanceProfile';

import { downloadColumnProps, nameColumnProps } from '../constants/table';

const systemColumnProps = [
  downloadColumnProps,
  { ...nameColumnProps,
    flexGrow: 0,
    onHeaderClick: () => {},
  },
];

function buildAntibioticColumnProps(antibiotics) {
  return antibiotics.map(antibiotic => ({
    columnKey: antibiotic,
    headerClasses: 'wgsa-table-header--resistance',
    cellClasses: 'wgsa-table-cell--resistance',
    fixedWidth: 40,
    flexGrow: 0,
    getCellContents({ columnKey }, { analysis }) {
      const value = analysis.resistanceProfile[columnKey];
      if (value) {
        return (
          <i title={value} className={`material-icons wgsa-resistance-icon wgsa-resistance-icon--${value.toLowerCase()}`}>
            { value === 'RESISTANT' ? 'add_box' : '' }
          </i>
        );
      }
      return null;
    },
    valueGetter: (assembly) => getColour(antibiotic, assembly),
    onHeaderClick,
  }));
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
        fixedWidth:
          Math.cos(45 * Math.PI / 180) *
            measureText(antibiotics[antibiotics.length - 1]) - 24,
        getCellContents() {},
        cellClasses: 'wgsa-table-cell--resistance',
      },
    ];

    return {
      ...state,
      columns,
      tableProps: {
        headerHeight: antibiotics.reduce((maxWidth, antibiotic) =>
          Math.max(maxWidth, measureText(antibiotic))
        , 0),
      },
    };
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
