import React from 'react';
import { connect } from 'react-redux';

import { CGPS } from '../app/constants';

const titleStyle = {
  textAlign: 'center',
  color: CGPS.COLOURS.PURPLE,
};

export default connect()(React.createClass({

  render() {
    return (
      <div className="mdl-layout wgsa-loading-container">
        <div className="wgsa-loading-content">
          <a href="/">
            <img src="/images/WGSA.FINAL.svg" className="wgsa-loading-logo" />
          </a>
          <h1 style={titleStyle}>
            These aren't the bacteria you're looking for.
          </h1>
          <a style={titleStyle} href="/">Homepage</a>
        </div>
      </div>
    );
  },

}));
