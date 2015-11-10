import '../../css/loading.css';
import '../../css/progress-bar.css';

import React from 'react';

import { CGPS } from '^/defaults';

const backgroundStyle = {
  background: CGPS.COLOURS.GREY_LIGHT,
};

export default React.createClass({

  displayName: 'Loading',

  propTypes: {
    error: React.PropTypes.string,
  },

  componentDidMount() {
    componentHandler.upgradeElement(this.refs.spinner);
  },

  render() {
    return this.props.error ? (
      <main style={backgroundStyle} className="wgsa-loading-container">
        <h1>We're sorry, this collection is currently unavailable.</h1>
        <p>Please try again later, or contact <a href="mailto:cgps@sanger.ac.uk">cgps@sanger.ac.uk</a> if problems persist.</p>
      </main>
    ) : (
      <main style={backgroundStyle} className="wgsa-loading-container">
        <div ref="spinner" className="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"></div>
        <h1>Loading collection...</h1>
      </main>
    );
  },

});
