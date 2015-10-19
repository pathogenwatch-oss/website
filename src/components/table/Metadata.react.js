import React from 'react';

import FixedTable from './FixedTable.react';
import DownloadButton from '../DownloadButton.react';

import ReferenceCollectionStore from '../../stores/ReferenceCollectionStore';
import UploadedCollectionStore from '../../stores/UploadedCollectionStore';
import FilteredDataStore from '../../stores/FilteredDataStore';

import FilteredDataActionCreators from '../../actions/FilteredDataActionCreators';

import MetadataUtils from '../../utils/Metadata';

const systemColumnProps = [
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
  { label: 'ASSEMBLY',
    dataKey: '__assembly',
    fixed: true,
    labelGetter({ metadata }) {
      return metadata.assemblyName;
    },
  },
  { label: 'LOCATION',
    dataKey: '__location',
    labelGetter({ metadata }) {
      return metadata.geography.location;
    },
  },
  { label: 'DATE',
    dataKey: '__date',
    labelGetter({ metadata }) {
      return MetadataUtils.getFormattedDateString(metadata.date);
    },
  },
  { label: 'ST',
    dataKey: '__st',
    labelGetter({ analysis }) {
      return analysis.st;
    },
  },
  { label: 'MLST',
    dataKey: '__mlst',
    labelGetter({ analysis }) {
      return analysis.mlst;
    },
  },
  { label: 'KERNEL SIZE',
    dataKey: '__kernel_size',
    labelGetter({ analysis }) {
      return analysis.kernelSize;
    },
  },
];

let userDefinedColumnProps = [];

function allColumnProps() {
  return systemColumnProps.concat(userDefinedColumnProps);
}

function getAssembly(assemblyId) {
  const referenceCollectionAssemblies = ReferenceCollectionStore.getAssemblies();
  const uploadedCollectionAssemblies = UploadedCollectionStore.getAssemblies();
  return referenceCollectionAssemblies[assemblyId] || uploadedCollectionAssemblies[assemblyId];
}

function mapAssemblyIdToTableRow(assemblyId) {
  const assembly = getAssembly(assemblyId);

  return allColumnProps().reduce(function (memo, { dataKey, labelGetter }) {
      if (labelGetter) {
        memo[dataKey] = labelGetter(assembly);
      }
      return memo;
    }, {});
}

function setLabelGetter({ labelGetter }) {
  FilteredDataActionCreators.setLabelGetter(labelGetter);
}

export default React.createClass({

  displayName: 'Metadata',

  propTypes: {
    height: React.PropTypes.number,
    width: React.PropTypes.number,
  },

  getInitialState() {
    if (!userDefinedColumnProps.length) {
      userDefinedColumnProps =
        FilteredDataStore.getUserDefinedColumns().map((column) => {
          return {
            label: column.toUpperCase(),
            dataKey: column,
            labelGetter({ metadata }) {
              return metadata.userDefined[column];
            },
          };
        });
    }

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
        columns={allColumnProps()}
        headerClickHandler={setLabelGetter}
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
