import React from 'react';
import { connect } from 'react-redux';

import FixedTable from '^/components/FixedTable.react';
import DownloadButton from '../DownloadButton.react';

import FilteredDataActionCreators from '^/actions/FilteredDataActionCreators';

import MetadataUtils from '^/utils/Metadata';

const systemColumnProps = [
  { label: '',
    dataKey: '__download',
    width: 50,
    flexGrow: 0,
    fixed: true,
    cellRenderer(_, __, data) {
      return (
        <DownloadButton
          id={data.assemblyId}
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
  { label: 'MLST PROFILE',
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

function mapAssemblyToTableRow(assembly) {
  const { assemblyId } = assembly.metadata;

  return allColumnProps().reduce(function (memo, { dataKey, labelGetter }) {
    if (labelGetter) {
      memo[dataKey] = labelGetter(assembly);
    }
    return memo;
  }, { assemblyId });
}

function setLabelGetter(columnDef) {
  FilteredDataActionCreators.setActiveColumn(columnDef);
}

const Metadata = React.createClass({

  displayName: 'Metadata',

  propTypes: {
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    data: React.PropTypes.array,
  },

  render() {
    console.log('RENDER');
    return (
      <FixedTable
        data={this.props.data}
        columns={allColumnProps()}
        headerClickHandler={setLabelGetter}
        { ...this.props }
      />
    );
  },

});

function mapStateToProps({ entities, ui }) {
  const { assemblies } = entities.collections.uploaded;
  const assemblyIds = Object.keys(assemblies);

  userDefinedColumnProps =
    ui.userDefinedColumns.map((column) => {
      return {
        label: column.toUpperCase(),
        dataKey: column,
        labelGetter({ metadata }) {
          return metadata.userDefined[column];
        },
      };
    });

  return {
    data: assemblyIds.reduce((data, id) => {
      data.push(mapAssemblyToTableRow(assemblies[id]));
      return data;
    }, []),
  };
}

export default connect(mapStateToProps)(Metadata);
