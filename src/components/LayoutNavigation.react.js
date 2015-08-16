import React from 'react';

import TableMetadata from './layout/navigation/TableMetadata.react';
import TableResistanceProfile from './layout/navigation/TableResistanceProfile.react';

const style = {
  height: 0,
};

export default React.createClass({
  render: function () {
    return (
      <div data-layout="navigation" style={style}>
        <TableMetadata />
        <TableResistanceProfile />
      </div>
    );
  },
});
