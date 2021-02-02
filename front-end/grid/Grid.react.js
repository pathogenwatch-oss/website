import React from 'react';
import { AutoSizer, Grid } from 'react-virtualized';

const GridItem = ({ style, children }) => (
  <div style={style} className="wgsa-grid-item">
    {children}
  </div>
);

export default React.createClass({

  propTypes: {
    className: React.PropTypes.string,
    columnWidth: React.PropTypes.number,
    columnCount: React.PropTypes.oneOfType([
      React.PropTypes.number, React.PropTypes.array,
    ]),
    items: React.PropTypes.array,
    rowHeight: React.PropTypes.number,
    template: React.PropTypes.func,
  },

  getColumnCount(width) {
    if (this.props.columnCount) {
      return this.parseColumnCount(width);
    }
    return Math.max(1, Math.floor(width / this.props.columnWidth));
  },

  getColumnWidth(width, columnCount) {
    const { columnWidth, rightMargin } = this.props;
    return (
      (columnWidth || Math.floor(width / columnCount)) -
        (rightMargin ? rightMargin / columnCount : 0)
    );
  },

  getRowHeight(columnWidth) {
    const { rowHeight, rowMinHeight = 0, rowMaxHeight = Number.MAX_VALUE, cellArea, rowFooterHeight = 0 } = this.props;
    return Math.min(
        Math.max(
        rowMinHeight,
        (rowHeight || (cellArea / columnWidth)) + rowFooterHeight
      ),
      rowMaxHeight
    );
  },

  parseColumnCount(width) {
    const { columnCount } = this.props;
    if (Array.isArray(columnCount)) {
      let newCount = 1;
      for (const { minWidth = 0, count } of columnCount) {
        if (minWidth > width) return newCount;
        newCount = count;
      }
      return newCount;
    }
    return columnCount; // just a number
  },

  render() {
    const { template, items, headerHeight = 0 } = this.props;
    return (
      <div className={this.props.className}>
        {this.props.header}
        <AutoSizer>
          {({ height, width }) => {
            const columnCount = this.getColumnCount(width);
            const columnWidth = this.getColumnWidth(width, columnCount);
            return (
              <Grid
                cellRenderer={({ key, columnIndex, rowIndex, style }) => {
                  const item = items[columnIndex + rowIndex * columnCount];
                  return item ?
                    <GridItem key={key} style={style}>
                      { React.createElement(template, { item }) }
                    </GridItem> :
                    null;
                }}
                className="wgsa-virtualised-grid"
                columnCount={columnCount}
                columnWidth={columnWidth}
                rowCount={Math.ceil(items.length / columnCount)}
                rowHeight={this.getRowHeight(columnWidth)}
                width={width}
                height={height - headerHeight}
              />
            );
          }}
        </AutoSizer>
      </div>
    );
  },

});
