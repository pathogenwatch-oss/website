import React from 'react';
import { connect } from 'react-redux';

export default connect()(React.createClass({

  goBack(e) {
    if (window.history) {
      e.preventDefault();
      window.history.back();
    }
  },

  render() {
    return (
      <div className="mdl-layout wgsa-loading-container wgsa-not-found">
        <div className="wgsa-loading-content">
          <a href="/">
            <img src="/images/WGSA.FINAL.svg" className="wgsa-loading-logo" />
          </a>
          <h1>These aren't the bacteria you're looking for.</h1>
          <p>(This page could not be found)</p>
          <a className="mdl-button" onClick={this.goBack} href="#">Go back</a>
        </div>
      </div>
    );
  },

}));
