import React from 'react';
import { connect } from 'react-redux';

import { updateHeader } from '^/actions/header';

import { CGPS } from '../app/constants';

const titleStyle = {
  textAlign: 'center',
  color: CGPS.COLOURS.PURPLE,
};

export default connect()(React.createClass({

  componentWillMount() {
    this.props.dispatch(updateHeader({
      classNames: 'mdl-shadow--3dp',
    }));
  },

  render() {
    return (
      <div className="mdl-layout wgsa-loading-container">
        <div className="wgsa-loading-content">
          <a href="/">
            <img src="/assets/img/WGSA.FINAL.svg" className="wgsa-loading-logo" />
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
