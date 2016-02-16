import React from 'react';
import { connect } from 'react-redux';

import FixedTable from '^/components/FixedTable.react';

import { activateFilter, resetFilter } from '^/actions/filter';

import { addColumnWidth } from '^/constants/table';
import { addDownloadProps } from '^/constants/downloads';

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

  componentDidMount() {
    componentHandler.upgradeDom();
  },

  componentDidUpdate() {
    componentHandler.upgradeDom();
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
    downloads: {
      fasta: downloads.files.fasta,
      gff: downloads.files.wgsa_gff,
    },
  };
}

function mapStateToColumn(column, state, dispatch) {
  return column.addState ? column.addState(state, dispatch) : column;
}

function mergeProps(state, { dispatch }, props) {
  const { downloads, data, columns, ...otherState } = state;
  return {
    ...props,
    ...otherState,
    dispatch,
    columns: columns.map(column => mapStateToColumn(column, state, dispatch)),
    data: data.map(row => addDownloadProps(row, downloads, dispatch)),
  };
}

export default connect(mapStateToProps, null, mergeProps)(SouthContent);
