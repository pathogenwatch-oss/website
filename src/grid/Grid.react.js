import React from 'react';
import { AutoSizer, Grid } from 'react-virtualized';
import classnames from 'classnames';

const GridItem = ({ key, style, children }) => (
  <div key={key} style={style} className="wgsa-grid-item">
    {children}
  </div>
);

export default React.createClass({

  propTypes: {
    className: React.PropTypes.string,
    columnWidth: React.PropTypes.number,
    columnCount: React.PropTypes.number,
    items: React.PropTypes.array,
    rowHeight: React.PropTypes.number.isRequired,
    template: React.PropTypes.element,
  },

  getColumnCount(width) {
    return (
      this.props.columnCount ||
      Math.max(1, Math.floor(width / this.props.columnWidth))
    );
  },

  getColumnWidth(width) {
    return (
      this.props.columnWidth ||
      Math.floor(width / this.props.columnCount)
    );
  },

  render() {
    const { template, items } = this.props;
    return (
      <div className={classnames('wgsa-content-margin-left', this.props.className)}>
        <AutoSizer>
          {({ height, width }) => {
            const columnCount = this.getColumnCount(width);
            return (
              <Grid
                cellRenderer={({ key, columnIndex, rowIndex, style }) => {
                  const item = items[columnIndex + rowIndex * columnCount];
                  return item ?
                    <GridItem key={key} style={style}>
                      { React.createElement(template, item) }
                    </GridItem> :
                    null;
                }}
                className="wgsa-virtualised-grid"
                columnWidth={this.getColumnWidth(width)}
                columnCount={columnCount}
                height={height}
                rowCount={Math.ceil(items.length / columnCount)}
                rowHeight={this.props.rowHeight}
                width={width}
              />
            );
          }}
        </AutoSizer>
      </div>
    );
  },

});
