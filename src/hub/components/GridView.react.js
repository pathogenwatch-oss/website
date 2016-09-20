import React from 'react';
import { AutoSizer, Grid } from 'react-virtualized';

import GridItem from './GridItem.react';

export default React.createClass({

  propTypes: {
    items: React.PropTypes.array.isRequired,
  },

  render() {
    const { items } = this.props;
    return (
      <AutoSizer>
        {({ height, width }) => {
          const columnWidth = 256;
          const columnCount = Math.max(1, Math.floor(width / columnWidth));
          return (
            <Grid
              cellRenderer={({ key, columnIndex, rowIndex, style }) => {
                const file = items[columnIndex + rowIndex * columnCount];
                return (
                  <div key={key} style={style}>
                    <GridItem { ...file } />
                  </div>
                );
              }}
              columnWidth={columnWidth}
              columnCount={columnCount}
              height={height}
              rowHeight={136}
              rowCount={Math.ceil(items.length / columnCount)}
              width={width}
              className="test"
            />
          );
        }}
      </AutoSizer>
    );
  },

});
