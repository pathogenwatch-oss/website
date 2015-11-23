import React from 'react';

import { FETCH_ENTITIES } from '../actions/fetch';

import { systemColumnProps } from '../constants/resistanceProfile';

const canvas = document.createElement('canvas').getContext('2d');
canvas.font = 'Bold 12px "Helvetica","Arial",sans-serif';

function buildAntibioticColumnProps(antibiotics) {
  return antibiotics.map(function (antibiotic) {
    return {
      label: antibiotic.toUpperCase(),
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
    };
  });
}

const actions = {
  [FETCH_ENTITIES]: function (state, { ready, result, error }) {
    if (ready && !error) {
      const antibiotics = Object.keys(result[2]);

      const columns =
        systemColumnProps.concat(buildAntibioticColumnProps(antibiotics));

      return {
        columns,
        calculatedColumnWidths: [ columns[0] ],
        tableProps: {
          headerHeight: antibiotics.reduce((maxWidth, antibiotic) => {
            return Math.max(maxWidth, canvas.measureText(antibiotic.toUpperCase()).width + 32);
          }, 0),
        },
        headerClick: () => {}, // TODO: Use action creator here
      };
    }

    return state;
  },
};

const initialState = [];

export default { actions, initialState };
