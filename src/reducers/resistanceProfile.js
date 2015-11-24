import React from 'react';

import { FETCH_ENTITIES } from '../actions/fetch';
import { SET_COLOUR_COLUMN, setColourColumn } from '../actions/columns';

import { systemColumnProps } from '../constants/resistanceProfile';
import { defaultColourGetter } from '../constants/tree';

import DEFAULT from '../defaults';

const canvas = document.createElement('canvas').getContext('2d');
canvas.font = 'Bold 12px "Helvetica","Arial",sans-serif';

function measureText(text) {
  return (canvas.measureText(text.toUpperCase()).width * Math.cos(0.785)) + 40;
}

function buildAntibioticColumnProps(antibiotics) {
  return antibiotics.map(function (antibiotic) {
    return {
      columnKey: antibiotic,
      headerClasses: 'wgsa-table-header--resistance',
      cellClasses: 'wgsa-table-cell--resistance',
      width: 24,
      getCellContents({ columnKey }, { analysis }) {
        const value = analysis.resistanceProfile[columnKey].resistanceResult;
        return (
          <i title={value} className={`material-icons wgsa-resistance-icon wgsa-resistance-icon--${value.toLowerCase()}`}>
            { value === 'RESISTANT' ? 'add_box' : '' }
          </i>
        );
      },
      valueGetter({ analysis }) {
        if (!analysis.resistanceProfile) return defaultColourGetter();
        const value = analysis.resistanceProfile[antibiotic].resistanceResult;
        return value === 'RESISTANT' ? DEFAULT.DANGER_COLOUR : '#fff';
      },
    };
  });
}

const actions = {
  [FETCH_ENTITIES]: function (state, { ready, result, error }) {
    if (ready && !error) {
      const antibiotics = Object.keys(result[2]);

      const columns =
        systemColumnProps.concat(buildAntibioticColumnProps(antibiotics));

      columns.push({
        columnKey: '__spacer',
        noHeader: true,
        width: measureText(antibiotics[antibiotics.length - 1]) - 40,
        getCellContents() {},
      });

      return {
        columns,
        calculatedColumnWidths: [ columns[0] ],
        tableProps: {
          headerHeight: antibiotics.reduce((maxWidth, antibiotic) => {
            return Math.max(maxWidth, measureText(antibiotic));
          }, 0),
        },
        headerClick(column, display) {
          if (display.colourColumn === column) {
            return setColourColumn();
          }
          return setColourColumn(column);
        },
      };
    }

    return state;
  },
  [SET_COLOUR_COLUMN]: function (state, { column }) {
    return {
      ...state,
      columns: state.columns.map(function (previous) {
        return {
          ...previous,
          selected: column.columnKey === previous.columnKey,
        };
      }),
    };
  },
};

const initialState = [];

export default { actions, initialState };
