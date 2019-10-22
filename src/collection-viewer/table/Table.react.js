import React from 'react';
import { connect } from 'react-redux';

import FixedTable from '../../fixed-table';
import TableSwitcher from '../table/Switcher.react';
import Fade from '~/components/fade';

import { getCollection, getActiveGenomes } from '../selectors';
import {
  getActiveColumns,
  getVisibleTable,
  getVisibleTableName,
  getFixedGroupWidth,
} from '../table/selectors';

import { onRowClick } from './thunks';

import { addColumnWidth } from '../table/columnWidth';
import { getColumnLabel, setFixedGroupMinWidth } from './utils';

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
    return (
      <section
        onClick={this.props.onClick}
        onWheel={preventDefault}
        onTouchMove={preventDefault}
      >
        <TableSwitcher />
        <Fade>
          <FixedTable
            key={this.props.tableName}
            { ...this.props }
            rowClickHandler={this.props.onRowClick}
            getDefaultHeaderContent={this.props.getDefaultHeaderContent}
          />
        </Fade>
        { this.props.data.length === 0 &&
          <p className="wgsa-text-overlay wgsa-hipster-style">
            No matching results.
          </p> }
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
  return {
    ...table,
    activeColumns: getActiveColumns(state),
    collection: getCollection(state),
    data: getActiveGenomes(state),
    fixedGroupWidth: getFixedGroupWidth(state),
    tableName: getVisibleTableName(state),
  };
}

function mapStateToColumn(column, state, dispatch) {
  column.isSelected = state.activeColumns.has(column.columnKey);

  if (column.group) {
    for (let i = 0; i < column.columns.length; i++) {
      column.columns[i] = mapStateToColumn(column.columns[i], state, dispatch);
    }
    return column;
  }

  if (column.addState) return column.addState(state, dispatch);
  return state.data.length ? addColumnWidth(column, state) : column;
}

function mergeProps(state, { dispatch }, props) {
  const { data, columns, activeColumns, tableName } = state;

  const mappedColumns =
    columns.map(column => mapStateToColumn(column, state, dispatch));

  setFixedGroupMinWidth(mappedColumns, props.width, state.fixedGroupWidth);

  return {
    ...props,
    activeColumns,
    data,
    tableName,
    columns: mappedColumns,
    onRowClick: row => dispatch(onRowClick(row)),
    getDefaultHeaderContent: columnProps => (
      <DefaultColumnHeader
        column={columnProps}
        onClick={(event, column) => {
          event.stopPropagation();
          if (column.noAction) return;
          const handleEvent = column.onHeaderClick || state.onHeaderClick;
          dispatch(handleEvent(event, column));
        }}
      />
    ),
  };
}

export default connect(mapStateToProps, null, mergeProps)(Table);
