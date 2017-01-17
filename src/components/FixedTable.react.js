import 'fixed-data-table/dist/fixed-data-table.css';
import '../css/fixed-data-table-overrides.css';

import React from 'react';
import { Table, ColumnGroup, Column, Cell } from 'fixed-data-table';

import { getColumnLabel, getCellValue } from '../table/utils';

function getClassNames(baseClass, selected, extraClasses) {
  return (
    baseClass +
    (selected ? ` ${baseClass}--selected ` : ' ') +
    (extraClasses || '')
  ).trim();
}

const getHeaderClassNames = getClassNames.bind(null, 'wgsa-table-header');
const getCellClassNames = getClassNames.bind(null, 'wgsa-table-cell');


export const DefaultColumnHeader =
  ({ handleHeaderClick, columnProps, title }) => (
    <button
      title={title}
      className="wgsa-selectable-column-heading"
      onClick={event => handleHeaderClick(event, columnProps)}
    >
      {getColumnLabel(columnProps)}
    </button>
  );

function isVisible(column) {
  return (
    column.group ?
      column.system || column.columns.some(_ => _.valueGetter && !_.hidden) :
      !column.hidden
  );
}

export default React.createClass({

  displayName: 'FixedTable',

  propTypes: {
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    tableProps: React.PropTypes.object,
    columns: React.PropTypes.array,
    data: React.PropTypes.array,
    calculatedColumnWidths: React.PropTypes.array,
    headerClickHandler: React.PropTypes.func,
    rowClickHandler: React.PropTypes.func,
    activeColumns: React.PropTypes.object,
  },

  handleHeaderClick(e, columnProps) {
    e.stopPropagation();
    this.props.headerClickHandler(e, columnProps);
  },

  handleRowClick(e, index) {
    e.stopPropagation();
    this.props.rowClickHandler(this.props.data[index]);
  },

  isSelected(column) {
    if (column.system) return false;

    const columns =
      (column.group ? column.columns : [ column ]).
        filter(_ => isVisible(_) && _.valueGetter);

    return columns.length ?
      columns.every(c => this.props.activeColumns.has(c)) :
      false;
  },

  renderHeader(columnProps, headerProps) {
    const { headerClasses, headerTitle, getHeaderContent } = columnProps;
    const isSelected = this.isSelected(columnProps);
    return (
      <Cell
        {...headerProps}
        className={getHeaderClassNames(isSelected, headerClasses)}
      >
        { getHeaderContent ?
          getHeaderContent(columnProps) :
          <DefaultColumnHeader
            title={headerTitle}
            columnProps={columnProps}
            handleHeaderClick={this.handleHeaderClick}
          />
        }
      </Cell>
    );
  },

  renderCell(columnProps, { rowIndex, width, height }) {
    const { cellClasses, getCellContents = getCellValue } = columnProps;
    const isSelected = this.isSelected(columnProps);
    return (
      <Cell
        {...{ width, height }}
        className={getCellClassNames(isSelected, cellClasses)}
      >
        {getCellContents(columnProps, this.props.data[rowIndex])}
      </Cell>
    );
  },

  renderColumns(columnDefs) {
    return columnDefs.
      filter(isVisible).
      map(props =>
        (props.group ?
          <ColumnGroup
            key={props.columnKey}
            fixed={props.fixed}
            header={headerProps => this.renderHeader(props, headerProps)}
          >
            {this.renderColumns(props.columns)}
          </ColumnGroup> :
          <Column
            key={props.columnKey}
            header={headerProps => this.renderHeader(props, headerProps)}
            cell={cellProps => this.renderCell(props, cellProps)}
            width={props.fixedWidth || props.width || 96}
            flexGrow={0}
            { ...props }
          />
        )
      );
  },

  render() {
    const { data, columns, height, width, tableProps } = this.props;
    return (
      <Table
        rowsCount={data.length}
        rowHeight={28}
        headerHeight={28 + (columns[0].group ? 0 : 24)}
        groupHeaderHeight={24}
        height={height}
        width={width}
        className="wgsa-table"
        rowClassNameGetter={() => 'wgsa-table-row'}
        onRowClick={this.handleRowClick}
        {...tableProps}
      >
        {this.renderColumns(columns)}
      </Table>
    );
  },

});
