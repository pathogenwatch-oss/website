import 'fixed-data-table/dist/fixed-data-table.css';
import '../css/table.css';

import React from 'react';
import { Table, Column } from 'fixed-data-table';

const canvas = document.createElement('canvas').getContext('2d');
canvas.font = '13px "Helvetica","Arial",sans-serif';

const cellPadding = 36;
function calculateColumnWidths(columns, data) {
  return columns.reduce((widths, column) => {
    const columnLabelWidth = canvas.measureText(column.toUpperCase()).width + cellPadding;
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
    return {
      columnWidths: calculateColumnWidths(
        this.props.calculatedColumnWidths || this.props.columns.map(_ => _.dataKey),
        this.props.data
      ),
    };
  },

  getRow(index) {
    return this.props.data[index];
  },

  renderClickableHeader(label, dataKey, columnProps) {
    return (
      <div>
        <button title={label} data-column={dataKey}
          onClick={this.handleHeaderClick.bind(null, columnProps)}>{label}</button>
      </div>
    );
  },

  render() {
    return (
      <Table
        rowHeight={48}
        headerHeight={64}
        rowGetter={this.getRow}
        rowsCount={this.props.data.length}
        height={this.props.height}
        width={this.props.width}
        onRowClick={this.handleRowClick}
        isColumnResizing={this.isColumnResizing}
        onColumnResizeEndCallback={this.handleColumnResize}
        { ...this.props.tableProps } >
        { this.props.columns.map((props) =>
            <Column
              key={props.dataKey}
              headerClassName={'wgsa-table-header'}
              headerRenderer={this.renderClickableHeader}
              columnData={props}
              cellClassName={'wgsa-table-cell'}
              width={this.state.columnWidths[props.dataKey] || 96}
              flexGrow={1}
              { ...props }
            />
        )}
      </Table>
    );
  },

  handleHeaderClick(columnProps) {
    this.props.headerClickHandler(columnProps);
  },

  handleRowClick(e, index, rowData) {
    this.props.rowClickHandler(rowData);
  },

  isColumnResizing: false,

  handleColumnResize(newWidth, dataKey) {
    const { columnWidths } = this.state;
    columnWidths[dataKey] = newWidth;
    this.isColumnResizing = false;
    this.setState({
      columnWidths,
    });
  },

});
