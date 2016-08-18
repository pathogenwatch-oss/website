import React from 'react';

import { FETCH_ENTITIES } from '../actions/fetch';
import { SET_COLOUR_COLUMN, setColourColumn } from '../actions/table';

import { downloadColumnProps, nameColumnProps } from '../constants/table';
import { defaultColourGetter } from '../constants/tree';

import DEFAULT from '../defaults';

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
  return antibiotics.map(antibiotic => {
    return {
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
      },
      valueGetter(assembly) {
        const { analysis } = assembly;
        if (!analysis.resistanceProfile) {
          return defaultColourGetter(assembly);
        }
        const value = analysis.resistanceProfile[antibiotic];
        return value === 'RESISTANT' ? DEFAULT.DANGER_COLOUR : '#fff';
      },
    };
  });
}

const initialActiveColumn = {
  valueGetter: defaultColourGetter,
};

const actions = {
  [FETCH_ENTITIES]: function (state, { ready, result, error }) {
    if (ready && !error) {
      const antibiotics = result[2];

      console.log(
        Math.cos(45 * Math.PI / 180) *
          measureText(antibiotics[antibiotics.length - 1]) - 24,
      );

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
          headerHeight: antibiotics.reduce((maxWidth, antibiotic) => {
            return Math.max(maxWidth, measureText(antibiotic));
          }, 0),
        },
      };
    }

    return state;
  },
  [SET_COLOUR_COLUMN]: function (state, { column }) {
    return {
      ...state,
      activeColumn:
        column.columnKey === nameColumnProps.columnKey ?
          initialActiveColumn :
          column,
    };
  },
};

const initialState = {
  activeColumn: initialActiveColumn,
  headerClick(column) {
    if (this.activeColumn === column || column === systemColumnProps[0]) {
      return setColourColumn(initialActiveColumn);
    }
    return setColourColumn(column);
  },
  columns: [],
};

export default { actions, initialState };
