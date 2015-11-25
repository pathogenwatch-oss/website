import 'fixed-data-table/dist/fixed-data-table.css';
import '../css/table.css';

import React from 'react';
import { Table, Column, Cell } from 'fixed-data-table';

import { formatColumnLabel } from '../constants/table';

const canvas = document.createElement('canvas').getContext('2d');
canvas.font = '13px "Helvetica","Arial",sans-serif';

const cellPadding = 36;

function measureText(text) {
  return canvas.measureText(text).width + cellPadding;
}

function calculateColumnWidths(columns, data) {
  return columns.reduce((widths, column) => {
    const { columnKey, getCellContents } = column;
    const columnLabelWidth = measureText(formatColumnLabel(columnKey));

    widths[columnKey] = data.reduce((maxWidth, row) => {
      return Math.max(
        maxWidth,
        columnLabelWidth,
        measureText(getCellContents(column, row) || ''),
      );
    }, 0);
    return widths;
  }, {});
}

function getClassNames(baseClass, selected, extraClasses) {
  return (
    baseClass +
    (selected ? ` ${baseClass}--selected ` : ' ') +
    (extraClasses || '')
  ).trim();
}

const getHeaderClassNames = getClassNames.bind(null, 'wgsa-table-header');
const getCellClassNames = getClassNames.bind(null, 'wgsa-table-cell');


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
    activeColumn: React.PropTypes.object,
  },

  getInitialState() {
    const { calculatedColumnWidths, columns, data } = this.props;
    return {
      columnWidths: calculateColumnWidths(
        calculatedColumnWidths || columns,
        data
      ),
    };
  },

  getRow(index) {
    return this.props.data[index];
  },

  renderHeader(columnProps, headerProps) {
    const { headerClasses, noHeader, columnKey } = columnProps;
    const isSelected = (columnProps === this.props.activeColumn);

    return (
      <Cell
        {...headerProps}
        className={getHeaderClassNames(isSelected, headerClasses)}
      >
        {!noHeader &&
          <button onClick={event => this.handleHeaderClick(event, columnProps)}>
            {formatColumnLabel(columnKey)}
          </button>
        }
      </Cell>
    );
  },

  renderCell(columnProps, { rowIndex, width, height }) {
    const { data, activeColumn } = this.props;
    const { cellClasses, getCellContents } = columnProps;
    const isSelected = (columnProps === activeColumn);

    return (
      <Cell
        {...{ width, height }}
        className={getCellClassNames(isSelected, cellClasses)}
      >
        { getCellContents(columnProps, data[rowIndex])}
      </Cell>
    );
  },

  render() {
    const { data, columns, height, width, tableProps } = this.props;
    return (
      <Table
        rowsCount={data.length}
        rowHeight={48}
        headerHeight={64}
        height={height}
        width={width}
        className="wgsa-table"
        rowClassNameGetter={() => 'wgsa-table-row'}
        onRowClick={this.handleRowClick}
        { ...tableProps }
      >
        { columns.map((props) =>
            <Column
              key={props.columnKey}
              header={this.renderHeader.bind(null, props)}
              cell={this.renderCell.bind(null, props)}
              width={this.state.columnWidths[props.columnKey] || 96}
              flexGrow={1}
              { ...props }
            />
        )}
      </Table>
    );
  },

  handleHeaderClick(e, columnProps) {
    e.stopPropagation();
    this.props.headerClickHandler(columnProps);
  },

  handleRowClick(e, index) {
    e.stopPropagation();
    this.props.rowClickHandler(this.props.data[index]);
  },

});
