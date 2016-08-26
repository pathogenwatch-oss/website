import React from 'react';

import { FETCH_ENTITIES } from '../actions/fetch';
import { SET_COLOUR_COLUMNS, setColourColumns } from '../actions/table';

import { getColour } from '../utils/resistanceProfile';

import { downloadColumnProps, nameColumnProps } from '../constants/table';

const canvas = document.createElement('canvas').getContext('2d');
canvas.font = 'Bold 12px "Helvetica","Arial",sans-serif';

const systemColumnProps = [
  downloadColumnProps,
  { ...nameColumnProps,
    flexGrow: 0,
  },
];

function measureText(text) {
  return (
    canvas.measureText(text.toUpperCase()).width * Math.cos(45 * Math.PI / 180)
  ) + 40;
}

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
  }));
}

const actions = {
  [FETCH_ENTITIES](state, { ready, result, error }) {
    if (ready && !error) {
      const antibiotics = result[2];

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
    }

    return state;
  },
  [SET_COLOUR_COLUMNS](state, { column }) {
    return {
      ...state,
      activeColumns: column,
    };
  },
};

const initialState = {
  activeColumns: new Set(),
  handleHeaderClick(event, column, dispatch) {
    if (column.columnKey === nameColumnProps.columnKey) {
      dispatch(setColourColumns(new Set()));
      return;
    }

    const cumulative = (event.metaKey || event.ctrlKey);

    if (cumulative && this.activeColumns.has(column)) {
      this.activeColumns.delete(column);
      dispatch(setColourColumns(new Set(this.activeColumns)));
      return;
    }

    if (cumulative) {
      this.activeColumns.add(column);
      dispatch(setColourColumns(new Set(this.activeColumns)));
      return;
    }

    dispatch(setColourColumns(new Set([ column ])));
  },
  columns: [],
};

export default { actions, initialState };
