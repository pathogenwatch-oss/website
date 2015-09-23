import '../css/loading.css';
import '../css/progress-bar.css';

import React from 'react';

import Species from '../species';
import { CGPS } from '../defaults';

const backgroundStyle = {
  background: CGPS.COLOURS.GREY_LIGHT,
};

const Loading = React.createClass({

  componentDidMount: function () {
    componentHandler.upgradeElement(this.refs.spinner.getDOMNode());
  },

  render: function () {
    return (
      <main style={backgroundStyle} className="wgsa-loading-container">
        <div ref="spinner" className="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"></div>
        <h1>Loading collection...</h1>
      </main>
    );
  },

});



module.exports = Loading;
