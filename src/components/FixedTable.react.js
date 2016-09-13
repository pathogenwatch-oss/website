import 'fixed-data-table/dist/fixed-data-table.css';
import '../css/fixed-data-table-overrides.css';
import '../css/table.css';

import React from 'react';
import { Table, Column, Cell } from 'fixed-data-table';

import { formatColumnLabel, getCellValue } from '../utils/table';

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
      {formatColumnLabel(columnProps.columnKey)}
    </button>
  );

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
    return this.props.activeColumns.has(column);
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
        { getCellContents(columnProps, this.props.data[rowIndex])}
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
              header={(headerProps) => this.renderHeader(props, headerProps)}
              cell={(cellProps) => this.renderCell(props, cellProps)}
              width={props.fixedWidth || props.width || 96}
              flexGrow={1}
              { ...props }
            />
        )}
      </Table>
    );
  },

});
