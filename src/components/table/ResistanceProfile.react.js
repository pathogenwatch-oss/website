import React from 'react';
import assign from 'object-assign';

import FixedTable from './FixedTable.react';

import AntibioticsStore from '../../stores/AntibioticsStore';
import ReferenceCollectionStore from '../../stores/ReferenceCollectionStore';
import UploadedCollectionStore from '../../stores/UploadedCollectionStore';
import FilteredDataStore from '../../stores/FilteredDataStore';

import FilteredDataActionCreators from '../../actions/FilteredDataActionCreators';

let columnProps = [
  { label: 'Assembly',
    dataKey: 'name',
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

function mapAssemblyIdToTableRow(assemblyId) {
  const { metadata, analysis } = getAssembly(assemblyId);
  return assign({
    id: metadata.assemblyId,
    name: metadata.assemblyName,
  }, AntibioticsStore.list().reduce(function (memo, antibiotic) {
    if (!analysis.resistanceProfile[antibiotic]) {
      return memo;
    }
    memo[antibiotic] = analysis.resistanceProfile[antibiotic].resistanceResult;
    return memo;
  }, {}));
}

function setColourTableColumnName({ dataKey }) {
  FilteredDataActionCreators.setColourTableColumnName(dataKey);
}

export default React.createClass({

  displayName: 'ResistanceProfile',

  propTypes: {
    height: React.PropTypes.number,
    width: React.PropTypes.number,
  },

  componentWillMount() {
    if (columnProps.length > 1) {
      return;
    }

    columnProps = columnProps.concat(
      AntibioticsStore.list().map(function (antibiotic) {
        return {
          label: antibiotic,
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
      headerHeight: AntibioticsStore.list().reduce((maxWidth, antibiotic) => {
        return Math.max(maxWidth, canvas.measureText(antibiotic).width + 32);
      }, 0),
    };
  },

  componentDidMount() {
    FilteredDataStore.addChangeListener(this.handleFilteredDataStoreChange);
  },

  componentWillUnmount() {
    FilteredDataStore.removeChangeListener(this.handleFilteredDataStoreChange);
  },

  render() {
    return (
      <FixedTable
        data={FilteredDataStore.getAssemblyIds().map(mapAssemblyIdToTableRow)}
        columns={columnProps}
        calculatedColumnWidths={[ 'name' ]}
        tableProps={tableProps}
        headerClickHandler={setColourTableColumnName}
        { ...this.props }
      />
    );
  },

  handleFilteredDataStoreChange() {
    this.setState({
      data: FilteredDataStore.getAssemblyIds().map(mapAssemblyIdToTableRow),
    });
  },

});
