import React from 'react';
import { connect } from 'react-redux';

import FixedTable from '^/components/FixedTable.react';

import { activateFilter, resetFilter } from '^/actions/filter';

import { addColumnWidth } from '^/utils/table/columnWidth';
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

const preventDefault = e => e.preventDefault();

const SouthContent = React.createClass({

  displayName: 'SouthContent',

  propTypes: {
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    tableProps: React.PropTypes.object,
    data: React.PropTypes.array,
    columns: React.PropTypes.array,
    handleHeaderClick: React.PropTypes.func,
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

  onClick(dispatch, { target }) {
    if (target.classList.contains('public_Scrollbar_face') ||
        target.classList.contains('public_Scrollbar_main')) {
      return;
    }
    dispatch(resetFilter());
  },

  render() {
    const { dispatch, filter, activeColumns, onHeaderClick } = this.props;

    const headerClickHandler = (event, column) =>
      (column.onHeaderClick || onHeaderClick)(
        event, { column, activeColumns }, dispatch
      );

    return (
      <section
        style={sectionStyle}
        onClick={(...args) => this.onClick(dispatch, ...args)}
        onWheel={preventDefault}
        onTouchMove={preventDefault}
      >
        <FixedTable { ...this.props }
          rowClickHandler={({ metadata }) => handleRowClick(metadata, filter, dispatch)}
          headerClickHandler={headerClickHandler}
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
  const { entities, collection, display, tables, filter, downloads } = state;

  const table = tables[display.table];
  const { activeColumn, activeColumns, ...tableState } = table;

  return {
    ...tableState,
    activeColumns:
      activeColumn ? new Set([ activeColumn ]) : activeColumns,
    filter,
    collection,
    data: getTableData(entities.assemblies, filter),
    downloads: {
      fasta: downloads.files.fasta,
      wgsa_gff: downloads.files.wgsa_gff,
    },
  };
}

function mapStateToColumn(column, state, dispatch) {
  return column.addState ?
    column.addState(state, dispatch) :
    addColumnWidth(column, state.data);
}

function mergeProps(state, { dispatch }, props) {
  const { data, columns, ...otherState } = state;
  return {
    ...props,
    ...otherState,
    dispatch,
    columns: columns.map(column => mapStateToColumn(column, state, dispatch)),
    data: data.map(row => addDownloadProps(row, state, dispatch)),
  };
}

export default connect(mapStateToProps, null, mergeProps)(SouthContent);
