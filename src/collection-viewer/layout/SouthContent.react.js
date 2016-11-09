import React from 'react';
import { connect } from 'react-redux';

import FixedTable from '../../components/FixedTable.react';
import TableSwitcher from './TableSwitcher.react';

import { activateFilter, resetFilter } from '../filter/actions';
import { getActiveAssemblies } from '../selectors';
import { addColumnWidth } from '../../table/utils/columnWidth';
import { addDownloadProps } from '../../constants/downloads';

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
    const { dispatch, collectionViewer, activeColumns } = this.props;

    const headerClickHandler = (event, column) =>
      (column.onHeaderClick || this.props.onHeaderClick)(
        event, { column, activeColumns }, dispatch
      );

    return (
      <section
        onClick={(...args) => this.onClick(dispatch, ...args)}
        onWheel={preventDefault}
        onTouchMove={preventDefault}
      >
        <TableSwitcher />
        <FixedTable { ...this.props }
          rowClickHandler={({ metadata }) =>
            handleRowClick(metadata, collectionViewer.filter, dispatch)
          }
          headerClickHandler={headerClickHandler}
        />
      </section>
    );
  },

});

function mapStateToProps(state) {
  const { collection, collectionViewer, display, tables, downloads } = state;

  const table = tables[display.table];
  const { activeColumn, activeColumns, ...tableState } = table;

  return {
    ...tableState,
    activeColumns:
      activeColumn ? new Set([ activeColumn ]) : activeColumns,
    collection,
    data: getActiveAssemblies(state),
    downloads: {
      wgsa_gff: downloads.files.wgsa_gff,
    },
    collectionViewer,
  };
}

function mapStateToColumn(column, state, dispatch) {
  column.isSelected = state.activeColumns.has(column);

  return (
    column.addState ?
      column.addState(state, dispatch) :
      addColumnWidth(column, state)
  );
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
