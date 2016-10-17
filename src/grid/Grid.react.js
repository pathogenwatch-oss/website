import React from 'react';
import { AutoSizer, Grid } from 'react-virtualized';

export const GridView = React.createClass({

  propTypes: {
    className: React.PropTypes.string,
    columnWidth: React.PropTypes.number.isRequired,
    items: React.PropTypes.array,
    rowHeight: React.PropTypes.number.isRequired,
    template: React.PropTypes.element,
  },

  render() {
    const { template, items, columnWidth } = this.props;
    return (
      <div className={this.props.className}>
        <AutoSizer>
          {({ height, width }) => {
            const columnCount = Math.max(1, Math.floor(width / columnWidth));
            return (
              <Grid
                cellRenderer={({ key, columnIndex, rowIndex, style }) => {
                  const file = items[columnIndex + rowIndex * columnCount];
                  return file ?
                    React.createElement(template, { key, style, ...file }) :
                    null;
                }}
                className="wgsa-virtualised-grid"
                columnWidth={columnWidth}
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

export default GridView;
