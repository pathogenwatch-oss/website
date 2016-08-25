import React from 'react';

import { FETCH_ENTITIES } from '../actions/fetch';
import { SET_COLOUR_COLUMN, setColourColumn } from '../actions/table';

import { getColour } from '../utils/resistanceProfile';

import { downloadColumnProps, nameColumnProps } from '../constants/table';
import { defaultColourGetter } from '../constants/tree';

const canvas = document.createElement('canvas').getContext('2d');
canvas.font = 'Bold 12px "Helvetica","Arial",sans-serif';

const systemColumnProps = [
  ...downloadColumnProps,
  { ...nameColumnProps,
    flexGrow: 0,
  },
];

function measureText(text) {
  return (canvas.measureText(text.toUpperCase()).width * Math.cos(0.785)) + 40;
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
          fixedWidth: Math.cos(45 * Math.PI / 180) *
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
  [SET_COLOUR_COLUMN](state, { column }) {
    return {
      ...state,
      activeColumns: column,
    };
  },
};

const noActiveColumns = new Set([ { valueGetter: defaultColourGetter } ]);

function isDeselecting(activeColumns, column) {
  return (
    column.columnKey === nameColumnProps.columnKey ||
    (activeColumns.size === 1 && activeColumns.has(column))
  );
}

const initialState = {
  activeColumns: noActiveColumns,
  handleHeaderClick(event, column, dispatch) {
    if (isDeselecting(this.activeColumns, column)) {
      dispatch(setColourColumn(noActiveColumns));
      return;
    }

    if (this.activeColumns === noActiveColumns) {
      dispatch(setColourColumn(new Set([ column ])));
      return;
    }

    const cumulative = (event.metaKey || event.ctrlKey);

    if (cumulative && this.activeColumns.has(column)) {
      this.activeColumns.delete(column);
      dispatch(setColourColumn(
        this.activeColumns.size ?
          new Set(this.activeColumns) :
          noActiveColumns
      ));
      return;
    }

    if (cumulative) {
      this.activeColumns.add(column);
      dispatch(setColourColumn(new Set(this.activeColumns)));
      return;
    }

    dispatch(setColourColumn(new Set([ column ])));
  },
  columns: [],
};

export default { actions, initialState };
