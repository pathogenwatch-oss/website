import React from 'react';
import assign from 'object-assign';

import FixedTable from './FixedTable.react';
import DownloadButton from '../DownloadButton.react';

import ReferenceCollectionStore from '../../stores/ReferenceCollectionStore';
import UploadedCollectionStore from '../../stores/UploadedCollectionStore';
import FilteredDataStore from '../../stores/FilteredDataStore';

import DataUtils from '../../utils/Data';

let columnProps = [
  { label: '',
    dataKey: '__download',
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
    dataKey: '__name',
    fixed: true,
  },
  { label: 'Location',
    dataKey: '__location',
  },
  { label: 'Date',
    dataKey: '__date',
  },
  { label: 'Sequence Type',
    dataKey: '__st',
  },
  { label: 'MLST',
    dataKey: '__mlst',
  },
  { label: 'Complete Matches',
    dataKey: '__tcm',
  },
];

function getAssembly(assemblyId) {
  const referenceCollectionAssemblies = ReferenceCollectionStore.getAssemblies();
  const uploadedCollectionAssemblies = UploadedCollectionStore.getAssemblies();
  return referenceCollectionAssemblies[assemblyId] || uploadedCollectionAssemblies[assemblyId];
}

function mapAssemblyIdToTableRow(assemblyId) {
  const { metadata, analysis } = getAssembly(assemblyId);
  const { userDefined } = metadata;
  return assign({
    __id: metadata.assemblyId,
    __name: metadata.assemblyName,
    __location: metadata.geography.location,
    __date: DataUtils.getFormattedDateString(metadata.date),
    __st: analysis.st,
    __mlst: analysis.mlst,
    __tcm: analysis.totalCompleteMatches,
  }, userDefined || {});
}

export default React.createClass({

  displayName: 'Metadata',

  propTypes: {
    height: React.PropTypes.number,
    width: React.PropTypes.number,
  },

  getInitialState() {
    columnProps = columnProps.concat(
      FilteredDataStore.getUserDefinedColumns().map((column) => {
        return {
          label: column,
          dataKey: column,
        };
      })
    );

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

  render() {
    return (
      <FixedTable
        data={this.state.data}
        columns={columnProps}
        { ...this.props }
      />
    );
  },

  handleFilteredDataStoreChange() {
    console.log('filtered');
    this.setState({
      data: FilteredDataStore.getAssemblyIds().map(mapAssemblyIdToTableRow),
    });
  },

});
