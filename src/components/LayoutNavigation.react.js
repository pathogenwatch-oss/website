import React from 'react';

import TableMetadata from './layout/navigation/TableMetadata.react';
import TableResistanceProfile from './layout/navigation/TableResistanceProfile.react';

const style = {
  height: 0,
  position: 'absolute',
  zIndex: 999,
};

export default React.createClass({
  render: function () {
    style.top = this.props.top;
    return (
      <div data-layout="navigation" style={style}>
        <TableMetadata />
        <TableResistanceProfile />
      </div>
    );
  },
});
