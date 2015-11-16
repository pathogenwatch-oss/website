import React from 'react';
import assign from 'object-assign';

import { FETCH_ENTITIES } from '../actions/fetch';

import { systemColumnProps } from '../constants/resistanceProfile';

const canvas = document.createElement('canvas').getContext('2d');
canvas.font = 'Bold 12px "Helvetica","Arial",sans-serif';

function buildAntibioticColumnProps(antibiotics) {
  return antibiotics.map(function (antibiotic) {
    return {
      label: antibiotic.toUpperCase(),
      dataKey: antibiotic,
      headerClassName: 'wgsa-table-header wgsa-table-header--resistance',
      cellClassName: 'wgsa-table-cell wgsa-table-cell--resistance',
      width: 24,
      cellRenderer(value) {
        return (
          <i title={value} className={`material-icons wgsa-resistance-icon wgsa-resistance-icon--${value.toLowerCase()}`}>
            { value === 'RESISTANT' ? 'add_box' : '' }
          </i>
        );
      },
    };
  });
}

function mapAssemblyToTableRow({ metadata, analysis }, antibiotics) {
  return assign({
    id: metadata.assemblyId,
    __assembly: metadata.assemblyName,
  }, antibiotics.reduce(function (memo, antibiotic) {
    if (!analysis.resistanceProfile[antibiotic]) {
      return memo;
    }
    memo[antibiotic] = analysis.resistanceProfile[antibiotic].resistanceResult;
    return memo;
  }, {}));
}

const actions = {
  [FETCH_ENTITIES]: function (state, { ready, result, error }) {
    if (ready && !error) {
      const [ uploaded, , antibioticsResult ] = result;
      const { assemblies } = uploaded;
      const assemblyIds = Object.keys(assemblies);
      const antibiotics = Object.keys(antibioticsResult);

      const columns =
        systemColumnProps.concat(buildAntibioticColumnProps(antibiotics));

      return {
        columns,
        data: assemblyIds.reduce((data, id) => {
          data.push(mapAssemblyToTableRow(assemblies[id], antibiotics));
          return data;
        }, []),
        calculatedColumnWidths: [ '__assembly' ],
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
