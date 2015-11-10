import React from 'react';
import { connect } from 'react-redux';
import assign from 'object-assign';

import FixedTable from '^/components/FixedTable.react';

import ReferenceCollectionStore from '^/stores/ReferenceCollectionStore';
import UploadedCollectionStore from '^/stores/UploadedCollectionStore';
import FilteredDataStore from '^/stores/FilteredDataStore';

import FilteredDataActionCreators from '^/actions/FilteredDataActionCreators';

let columnProps = [
  { label: 'ASSEMBLY',
    dataKey: '__assembly',
    fixed: true,
  },
];

const canvas = document.createElement('canvas').getContext('2d');
canvas.font = 'Bold 12px "Helvetica","Arial",sans-serif';

let tableProps;

function getAssembly(assemblyId) {
  const referenceCollectionAssemblies = ReferenceCollectionStore.getAssemblies();
  const uploadedCollectionAssemblies = UploadedCollectionStore.getAssemblies();
  return referenceCollectionAssemblies[assemblyId] || uploadedCollectionAssemblies[assemblyId];
}

function setColourTableColumnName({ dataKey }) {
  FilteredDataActionCreators.setColourTableColumnName(dataKey);
}

const ResistanceProfile = React.createClass({

  displayName: 'ResistanceProfile',

  propTypes: {
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    antibiotics: React.PropTypes.array,
  },

  componentWillMount() {
    if (columnProps.length > 1) {
      return;
    }
    const { antibiotics } = this.props;

    columnProps = columnProps.concat(
      antibiotics.map(function (antibiotic) {
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
      })
    );

    tableProps = {
      headerHeight: antibiotics.reduce((maxWidth, antibiotic) => {
        return Math.max(maxWidth, canvas.measureText(antibiotic.toUpperCase()).width + 32);
      }, 0),
    };
  },

  render() {
    return (
      <FixedTable
        data={FilteredDataStore.getAssemblyIds().map(this.mapAssemblyIdToTableRow)}
        columns={columnProps}
        calculatedColumnWidths={[ '__assembly' ]}
        tableProps={tableProps}
        headerClickHandler={setColourTableColumnName}
        { ...this.props }
      />
    );
  },

  mapAssemblyIdToTableRow(assemblyId) {
    const { metadata, analysis } = getAssembly(assemblyId);
    return assign({
      id: metadata.assemblyId,
      __assembly: metadata.assemblyName,
    }, this.props.antibiotics.reduce(function (memo, antibiotic) {
      if (!analysis.resistanceProfile[antibiotic]) {
        return memo;
      }
      memo[antibiotic] = analysis.resistanceProfile[antibiotic].resistanceResult;
      return memo;
    }, {}));
  },

});

export default connect(function (state) {
  return {
    antibiotics: state.antibiotics,
  };
})(ResistanceProfile);
