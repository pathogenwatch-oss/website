import 'fixed-data-table/dist/fixed-data-table.css';
import '../css/table.css';

import React from 'react';
import { Table, Column, Cell } from 'fixed-data-table';

import { formatColumnLabel } from '../constants/table';

const canvas = document.createElement('canvas').getContext('2d');
canvas.font = '13px "Helvetica","Arial",sans-serif';

const cellPadding = 36;
function calculateColumnWidths(columns, data) {
  return columns.reduce((widths, column) => {
    const columnLabelWidth =
      canvas.measureText(formatColumnLabel(column)).width + cellPadding;

    widths[column] = data.reduce((maxWidth, row) => {
      return Math.max(
        maxWidth,
        columnLabelWidth,
        canvas.measureText(row[column] || '').width + cellPadding
      );
    }, 0);
    return widths;
  }, {});
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
    filter: React.PropTypes.object,
  },

  getInitialState() {
    const { calculatedColumnWidths, columns, data } = this.props;
    return {
      columnWidths: calculateColumnWidths(
        calculatedColumnWidths || columns.map(_ => _.columnKey),
        data
      ),
    };
  },

  getRow(index) {
    return this.props.data[index];
  },

  renderHeader(columnProps, headerProps) {
    const { headerClasses, noHeader, columnKey } = columnProps;
    return (
      <Cell
        {...headerProps}
        className={`wgsa-table-header ${headerClasses || ''}`.trim()}
      >
        {!noHeader &&
          <button onClick={() => this.props.headerClickHandler(columnProps)}>
            {formatColumnLabel(columnKey)}
          </button>
        }
      </Cell>
    );
  },

  renderCell(columnProps, { rowIndex, columnKey, ...dimensions }) {
    const { data } = this.props;
    const { cellClasses, getCellContents } = columnProps;
    return (
      <Cell
        {...dimensions}
        className={`wgsa-table-cell ${cellClasses || ''}`.trim()}
      >
        { getCellContents ?
            getCellContents(data[rowIndex], columnKey) :
            data[rowIndex][columnKey] }
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

  handleRowClick(e, index) {
    this.props.rowClickHandler(this.props.data[index]);
  },

});
