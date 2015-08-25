import React from 'react';

import { CGPS } from '../defaults';

const titleStyle = {
  textAlign: 'center',
  color: CGPS.COLOURS.PURPLE,
};

export default React.createClass({

  render: function () {
    return (
      <div className="mdl-layout">
        <div className="mdl-grid">
          <h1 style={titleStyle}>
            These are not the bacteria you're looking for.
          </h1>
        </div>
        <div className="mdl-grid">
          <a style={titleStyle} href="/">Homepage</a>
        </div>
      </div>
    );
  },

});
