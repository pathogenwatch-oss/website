import React from 'react';
import { Table, Column, Cell } from 'fixed-data-table';

function getClassNames(baseClass, selected, extraClasses) {
  return (
    baseClass +
    (selected ? ` ${baseClass}--selected ` : ' ') +
    (extraClasses || '')
  ).trim();
}

const getHeaderClassNames = getClassNames.bind(null, 'wgsa-table-header');
const getCellClassNames = getClassNames.bind(null, 'wgsa-table-cell');

const getCellValue = ({ valueGetter }, data) => valueGetter(data);

export default React.createClass({

  displayName: 'FixedTable',

  propTypes: {
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    tableProps: React.PropTypes.object,
    columns: React.PropTypes.array,
    data: React.PropTypes.array,
    calculatedColumnWidths: React.PropTypes.array,
    getDefaultHeaderContent: React.PropTypes.func,
    rowClickHandler: React.PropTypes.func,
    activeColumns: React.PropTypes.object,
  },

  handleRowClick(e, index) {
    e.stopPropagation();
    this.props.rowClickHandler(this.props.data[index]);
  },

  isSelected(column) {
    return this.props.activeColumns.has(column);
  },

  renderHeader(columnProps, headerProps) {
    const { headerClasses, getHeaderContent } = columnProps;
    const isSelected = this.isSelected(columnProps);

    return (
      <Cell
        {...headerProps}
        className={getHeaderClassNames(isSelected, headerClasses)}
      >
        { getHeaderContent ?
          getHeaderContent(columnProps) :
          this.props.getDefaultHeaderContent(columnProps)
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
        { getCellContents(columnProps, this.props.data[rowIndex])}
      </Cell>
    );
  },

  render() {
    const { data, columns, height, width, tableProps } = this.props;
    return (
      <Table
        rowsCount={data.length}
        rowHeight={28}
        headerHeight={56}
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
              header={headerProps => this.renderHeader(props, headerProps)}
              cell={cellProps => this.renderCell(props, cellProps)}
              width={props.fixedWidth || props.width || 96}
              flexGrow={1}
              { ...props }
            />
        )}
      </Table>
    );
  },

});
