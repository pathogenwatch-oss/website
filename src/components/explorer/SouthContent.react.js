import React from 'react';
import { connect } from 'react-redux';

import FixedTable from '^/components/FixedTable.react';

import { activateFilter, resetFilter } from '^/actions/filter';
import { requestDownload } from '^/actions/downloads';

import { addColumnWidth } from '^/constants/table';

const sectionStyle = {
  width: '100%',
  height: '100%',
};

function handleRowClick({ assemblyId }, { ids, active }, dispatch) {
  if (active && ids.size === 1 && ids.has(assemblyId)) {
    dispatch(resetFilter());
  } else {
    dispatch(activateFilter([ assemblyId ]));
  }
}

const SouthContent = React.createClass({

  displayName: 'SouthContent',

  propTypes: {
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    tableProps: React.PropTypes.object,
    data: React.PropTypes.array,
    columns: React.PropTypes.array,
    headerClick: React.PropTypes.func,
    dispatch: React.PropTypes.func,
    display: React.PropTypes.object,
    filter: React.PropTypes.object,
  },

  render() {
    const { dispatch, headerClick, filter } = this.props;
    return (
      <section style={sectionStyle} onClick={() => dispatch(resetFilter())}>
        <FixedTable { ...this.props }
          rowClickHandler={({ metadata }) => handleRowClick(metadata, filter, dispatch)}
          headerClickHandler={(column) => dispatch(headerClick(column))}
        />
      </section>
    );
  },

});

function getTableData(assemblies, filter) {
  const ids = filter.active ? filter.ids : filter.unfilteredIds;
  return [ ...ids ].map(id => assemblies[id]);
}

function mapStateToProps(state) {
  const { entities, display, tables, filter, downloads } = state;

  const table = tables[display.table];
  const { headerClick, columns, ...tableProps } = table;

  const data = getTableData(entities.assemblies, filter);
  return {
    ...tableProps,
    columns: columns.map(column => addColumnWidth(column, data)),
    headerClick: headerClick.bind(table),
    data,
    filter,
    fasta: downloads.files.fasta,
    gff: downloads.files.wgsa_gff,
  };
}

function addDownloadProps(row, { fasta, gff }, dispatch) {
  const id = row.metadata.assemblyId;
  return {
    ...row,
    faDownloadProps: {
      description: fasta.description,
      ...fasta.linksById ? fasta.linksById[id] : null,
      onClick: () => dispatch(requestDownload('fasta', null, [ id ])),
    },
    gffDownloadProps: {
      description: gff.description,
      ...gff.linksById ? gff.linksById[id] : null,
      onClick: () => dispatch(requestDownload('wgsa_gff', null, [ id ])),
    },
  };
}

function mergeProps({ fasta, gff, data, ...state }, { dispatch }, props) {
  return {
    ...props,
    ...state,
    dispatch,
    data: data.map(row => addDownloadProps(row, { fasta, gff }, dispatch)),
  };
}

export default connect(mapStateToProps, null, mergeProps)(SouthContent);
