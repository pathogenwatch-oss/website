import 'fixed-data-table/dist/fixed-data-table.css';
import '../../../css/table.css';

import React from 'react';
import { Table, Column } from 'fixed-data-table';

import DownloadButton from '../../DownloadButton.react';

import ReferenceCollectionStore from '../../../stores/ReferenceCollectionStore';
import UploadedCollectionStore from '../../../stores/UploadedCollectionStore';
import FilteredDataStore from '../../../stores/FilteredDataStore';

import DataUtils from '../../../utils/Data';

const canvas = document.createElement('canvas').getContext('2d');

const columnProps = [
  { label: 'Assembly',
    dataKey: 'name',
    fixed: true,
  },
  { label: 'Location',
    dataKey: 'location',
  },
  { label: 'Date',
    dataKey: 'date',
  },
  { label: 'Sequence Type',
    dataKey: 'st',
    // align: 'right',
  },
  { label: 'MLST',
    dataKey: 'mlst',
  },
  { label: 'Complete Matches',
    dataKey: 'tcm',
    // align: 'right',
  },
];

function getAssembly(assemblyId) {
  const referenceCollectionAssemblies = ReferenceCollectionStore.getAssemblies();
  const uploadedCollectionAssemblies = UploadedCollectionStore.getAssemblies();
  return referenceCollectionAssemblies[assemblyId] || uploadedCollectionAssemblies[assemblyId];
}

function mapAssemblyIdToTableRow(assemblyId) {
  const { metadata, analysis } = getAssembly(assemblyId);
  return {
    id: metadata.assemblyId,
    name: metadata.assemblyName,
    location: metadata.geography.location,
    date: DataUtils.getFormattedDateString(metadata.date),
    st: analysis.st,
    mlst: analysis.mlst,
    tcm: analysis.totalCompleteMatches,
  };
}


function calculateColumnWidths(currentWidths, data) {
  return Object.keys(data).reduce(function (memo, columnKey) {
    if (columnKey === 'id') return memo;

    const width = canvas.measureText(data[columnKey] || '').width;
    if (!memo[columnKey] || width > memo[columnKey] ) {
      memo[columnKey] = width;
    }
    return memo;
  }, currentWidths);
}

const DataTable = React.createClass({

  propTypes: {
    height: React.PropTypes.number,
    width: React.PropTypes.number,
  },

  getInitialState() {
    const data = FilteredDataStore.getAssemblyIds().map(mapAssemblyIdToTableRow);
    return {
      data,
      columnWidths: data.reduce(calculateColumnWidths, {}),
    };
  },

  componentDidMount() {
    FilteredDataStore.addChangeListener(this.handleFilteredDataStoreChange);
  },

  componentWillUnmount() {
    FilteredDataStore.removeChangeListener(this.handleFilteredDataStoreChange);
  },

  getRow(index) {
    return this.state.data[index];
  },

  getDownloadButton(_, __, data) {
    return (
      <DownloadButton
        id={data.id}
        format={'fasta'}
        description={'Assembly Fasta'} />
    );
  },

  render() {
    return (
      <Table
        rowHeight={48}
        headerHeight={64}
        rowGetter={this.getRow}
        rowsCount={this.state.data.length}
        height={this.props.height}
        width={this.props.width}
        isColumnResixing={this.isColumnResizing}
        onColumnResizeEndCallback={this.handleColumnResize}>
        <Column
          headerClassName={'wgsa-table-header'}
          cellClassName={'wgsa-table-cell'}
          width={48}
          label={''}
          fixed={true}
          cellRenderer={this.getDownloadButton} />
        { columnProps.map((props) =>
            <Column
              key={props.dataKey}
              headerClassName={'wgsa-table-header'}
              cellClassName={'wgsa-table-cell'}
              width={this.state.columnWidths[props.dataKey]}
              flexGrow={1}
              { ...props }
            />
        )}
      </Table>
    );
  },

  isColumnResizing: false,

  handleFilteredDataStoreChange() {
    this.setState({
      data: FilteredDataStore.getAssemblyIds().map(mapAssemblyIdToTableRow),
    });
  },

  handleColumnResize(newWidth, dataKey) {
    const { columnWidths } = this.state;
    columnWidths[dataKey] = newWidth;
    this.isColumnResizing = false;
    this.setState({
      columnWidths,
    });
  },

});

module.exports = DataTable;
