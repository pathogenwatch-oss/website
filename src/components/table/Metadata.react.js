import React from 'react';

import FixedTable from './FixedTable.react';
import DownloadButton from '../DownloadButton.react';

import ReferenceCollectionStore from '../../stores/ReferenceCollectionStore';
import UploadedCollectionStore from '../../stores/UploadedCollectionStore';
import FilteredDataStore from '../../stores/FilteredDataStore';

import DataUtils from '../../utils/Data';

const columnProps = [
  { label: '',
    dataKey: 'download',
    width: 50,
    flexGrow: 0,
    fixed: true,
    cellRenderer(_, __, data) {
      return (
        <DownloadButton
          id={data.id}
          format={'fasta'}
          description={'Assembly Fasta'} />
      );
    },
  },
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

export default React.createClass({

  displayName: 'Metadata',

  propTypes: {
    height: React.PropTypes.number,
    width: React.PropTypes.number,
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
