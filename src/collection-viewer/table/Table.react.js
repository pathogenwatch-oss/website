import React from 'react';
import { connect } from 'react-redux';

import FixedTable from '../../fixed-table';
import TableSwitcher from '../table/Switcher.react';

import { getCollection, getViewer } from '../../collection-route/selectors';
import { getActiveAssemblies } from '../selectors';
import { getVisibleTable } from '../table/selectors';
import { getFiles } from '../downloads/selectors';

import { onTableClick, onRowClick } from './thunks';

import { addColumnWidth } from '../table/utils/columnWidth';
import { addDownloadProps } from '../downloads/utils';
import { getColumnLabel } from './utils';
import Species from '../../species';

const preventDefault = e => e.preventDefault();

const Table = React.createClass({

  displayName: 'Table',

  propTypes: {
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    tableProps: React.PropTypes.object,
    data: React.PropTypes.array,
    columns: React.PropTypes.array,
    handleHeaderClick: React.PropTypes.func,
    dispatch: React.PropTypes.func,
    filter: React.PropTypes.object,
  },

  componentDidMount() {
    componentHandler.upgradeDom();
  },

  shouldComponentUpdate(previous) {
    const { data, columns, filter } = this.props;
    return (
      data !== previous.data ||
      columns !== previous.columns ||
      filter !== previous.filter
    );
  },

  componentDidUpdate() {
    componentHandler.upgradeDom();
  },

  render() {
    const { noAMR } = Species.uiOptions;
    return (
      <section
        onClick={this.props.onClick}
        onWheel={preventDefault}
        onTouchMove={preventDefault}
      >
        { noAMR ? null : <TableSwitcher /> }
        <FixedTable { ...this.props }
          rowClickHandler={this.props.onRowClick}
          getDefaultHeaderContent={this.props.getDefaultHeaderContent}
        />
      </section>
    );
  },

});

const DefaultColumnHeader =
  ({ column, onClick }) => (
    <button
      title={column.headerTitle}
      className="wgsa-selectable-column-heading"
      onClick={event => onClick(event, column)}
    >
      {getColumnLabel(column)}
    </button>
  );

function mapStateToProps(state) {
  const table = getVisibleTable(state);
  const { activeColumn, activeColumns, ...tableState } = table;

  return {
    ...tableState,
    activeColumns:
      activeColumn ? new Set([ activeColumn ]) : activeColumns,
    collection: getCollection(state),
    data: getActiveAssemblies(state),
    downloads: {
      wgsa_gff: getFiles(state).wgsa_gff,
    },
    collectionViewer: getViewer(state), // must be here to make selectors work :/
  };
}

function mapStateToColumn(column, state, dispatch) {
  column.isSelected = state.activeColumns.has(column);

  if (column.group) {
    for (let i = 0; i < column.columns.length; i++) {
      column.columns[i] = mapStateToColumn(column.columns[i], state, dispatch);
    }
    return column;
  }

  return (
    column.addState ?
      column.addState(state, dispatch) :
      addColumnWidth(column, state)
  );
}

function mergeProps(state, { dispatch }, props) {
  const { data, columns, activeColumns } = state;

  return {
    ...props,
    activeColumns,
    columns: columns.map(column => mapStateToColumn(column, state, dispatch)),
    data: data.map(row => addDownloadProps(row, state, dispatch)),
    onClick: (event) => dispatch(onTableClick(event)),
    onRowClick: row => dispatch(onRowClick(row)),
    getDefaultHeaderContent: columnProps => (
      <DefaultColumnHeader
        column={columnProps}
        onClick={(event, column) => {
          event.stopPropagation();
          const handleEvent = column.onHeaderClick || state.onHeaderClick;
          dispatch(handleEvent(event, column));
        }}
      />
    ),
  };
}

export default connect(mapStateToProps, null, mergeProps)(Table);
