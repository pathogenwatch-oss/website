import 'fixed-data-table/dist/fixed-data-table.css';
import '../../../css/table.css';

import React from 'react';
import { Table, Column } from 'fixed-data-table';

import DownloadButton from '../../DownloadButton.react';

import ReferenceCollectionStore from '../../../stores/ReferenceCollectionStore';
import UploadedCollectionStore from '../../../stores/UploadedCollectionStore';
import FilteredDataStore from '../../../stores/FilteredDataStore';

import DataUtils from '../../../utils/Data';

const initialColumnWidth = 175;
const columnProps = [
  { label: 'Assembly',
    dataKey: 'name',
    fixed: true,
  },
  { label: 'Location',
    dataKey: 'location',
    width: initialColumnWidth * 2,
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
  { label: 'Total Complete Matches',
    dataKey: 'tcm',
    // align: 'right',
  },
];

function getAssembly(assemblyId) {
  const publicCollectionAssemblies = ReferenceCollectionStore.getAssemblies();
  const uploadedCollectionAssemblies = UploadedCollectionStore.getAssemblies();
  return publicCollectionAssemblies[assemblyId] || uploadedCollectionAssemblies[assemblyId];
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

const DataTable = React.createClass({

  propTypes: {
    height: React.PropTypes.number,
    width: React.PropTypes.number,
  },

  getInitialState() {
    return {
      data: FilteredDataStore.getAssemblyIds().map(mapAssemblyIdToTableRow),
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
        headerHeight={48}
        rowGetter={this.getRow}
        rowsCount={this.state.data.length}
        height={this.props.height}
        width={this.props.width}>
        <Column
          headerClassName={'wgsa-table-header'}
          cellClassName={'wgsa-table-cell'}
          width={initialColumnWidth / 3}
          label={''}
          fixed={true}
          cellRenderer={this.getDownloadButton} />
        { columnProps.map((props) =>
            <Column
              key={props.dataKey}
              headerClassName={'wgsa-table-header'}
              cellClassName={'wgsa-table-cell'}
              width={initialColumnWidth}
              { ...props }
            />
        )}
      </Table>
    );
  },

  handleFilteredDataStoreChange() {
    this.setState({
      data: FilteredDataStore.getAssemblyIds().map(mapAssemblyIdToTableRow),
    });
  },

});

module.exports = DataTable;
