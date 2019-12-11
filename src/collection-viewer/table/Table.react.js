import React from 'react';
import { connect } from 'react-redux';

import FixedTable from '../../fixed-table';
import TableSwitcher from '../table/Switcher.react';
import Fade from '~/components/fade';

import { getCollection } from '../selectors';
import { getActiveGenomes } from '../selectors/active';
import {
  getVisibleTable,
  getVisibleTableName,
  getFixedGroupWidth,
} from './selectors';
import { getVisibleTableColumns } from './selectors/columns';

import { onRowClick } from './thunks';

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
    const { data, columns, filter, width, height } = this.props;
    return (
      data !== previous.data ||
      columns !== previous.columns ||
      filter !== previous.filter ||
      width !== previous.width ||
      height !== previous.height
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
            {...this.props}
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
  const { activeColumn, activeColumns, ...tableState } = table;

  return {
    ...tableState,
    activeColumns:
      activeColumn ? new Set([ activeColumn ]) : activeColumns,
    collection: getCollection(state),
    columns: getVisibleTableColumns(state),
    data: getActiveGenomes(state),
    fixedGroupWidth: getFixedGroupWidth(state),
    tableName: getVisibleTableName(state),
  };
}

function mergeProps(state, { dispatch }, props) {
  const { data, columns, activeColumns, tableName } = state;
  // hack required due to width being a prop
  setFixedGroupMinWidth(columns, props.width, state.fixedGroupWidth);
  return {
    ...props,
    activeColumns,
    data,
    tableName,
    columns,
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
