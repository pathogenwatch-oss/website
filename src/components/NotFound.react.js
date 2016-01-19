import React from 'react';

import { CGPS } from '../defaults';

const titleStyle = {
  textAlign: 'center',
  color: CGPS.COLOURS.PURPLE,
};

export default React.createClass({

  render: function () {
    return (
      <div className="mdl-layout wgsa-loading-container">
        <a href="/">
          <img src="/assets/img/WGSA.FINAL.svg" className="wgsa-loading-logo" />
        </a>
        <h1 style={titleStyle}>
          These are not the bacteria you're looking for.
        </h1>
        <a style={titleStyle} href="/">Homepage</a>
      </div>
    );
  },

});
