import React from 'react';

import FixedTable from './FixedTable.react';
import DownloadButton from '../DownloadButton.react';

import ReferenceCollectionStore from '../../stores/ReferenceCollectionStore';
import UploadedCollectionStore from '../../stores/UploadedCollectionStore';
import FilteredDataStore from '../../stores/FilteredDataStore';

import FilteredDataActionCreators from '../../actions/FilteredDataActionCreators';

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
    labelGetter({ metadata }) {
      return metadata.assemblyName;
    },
  },
  { label: 'Location',
    dataKey: '__location',
    labelGetter({ metadata }) {
      return metadata.geography.location;
    },
  },
  { label: 'Date',
    dataKey: '__date',
    labelGetter({ metadata }) {
      return DataUtils.getFormattedDateString(metadata.date);
    },
  },
  { label: 'Sequence Type',
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
  { label: 'Complete Matches',
    dataKey: '__tcm',
    labelGetter({ analysis }) {
      return analysis.totalCompleteMatches;
    },
  },
];

function getAssembly(assemblyId) {
  const referenceCollectionAssemblies = ReferenceCollectionStore.getAssemblies();
  const uploadedCollectionAssemblies = UploadedCollectionStore.getAssemblies();
  return referenceCollectionAssemblies[assemblyId] || uploadedCollectionAssemblies[assemblyId];
}

function mapAssemblyIdToTableRow(assemblyId) {
  const assembly = getAssembly(assemblyId);

  return columnProps.reduce(function (memo, { dataKey, labelGetter }) {
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
    columnProps = columnProps.concat(
      FilteredDataStore.getUserDefinedColumns().map((column) => {
        return {
          label: column,
          dataKey: column,
          labelGetter({ metadata }) {
            return metadata.userDefined[column];
          },
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
        headerClickHandler={setLabelGetter}
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
