import React from 'react';
import { AutoSizer, Grid } from 'react-virtualized';

import GridItem from './GridItem.react';

export default React.createClass({

  propTypes: {
    items: React.PropTypes.array,
  },

  render() {
    const { items } = this.props;
    return (
      <div className="wgsa-hub__view wgsa-hub-gutter-left">
        <AutoSizer>
          {({ height, width }) => {
            const columnWidth = 256;
            const columnCount = Math.max(1, Math.floor(width / columnWidth));
            return (
              <Grid
                cellRenderer={({ key, columnIndex, rowIndex, style }) => {
                  const file = items[columnIndex + rowIndex * columnCount];
                  return file ? (
                    <GridItem key={key} style={style} { ...file } />
                  ) : null;
                }}
                className="wgsa-virtualised-grid"
                columnWidth={columnWidth}
                columnCount={columnCount}
                height={height}
                rowCount={Math.ceil(items.length / columnCount)}
                rowHeight={160}
                width={width}
              />
            );
          }}
        </AutoSizer>
      </div>
    );
  },

});
