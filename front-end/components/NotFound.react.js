import React from 'react';
import { connect } from 'react-redux';

import { Logo } from '../branding';

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
            <Logo className="wgsa-loading-logo" />
          </a>
          <h1>Sorry, we were not able to find any content to show you</h1>
          <p>This may be because you are not <a href="https://cgps.gitbook.io/pathogenwatch/a-getting-started-tutorial#logging-in">logged in</a>, or an
            error, or because there was nothing to be found.</p>
          <p>If you have a question about why or believe there is an error, please <a href="mailto:pathogenwatch@cgps.group">e-mail us</a> or contact us via one of
            the methods described in <a href="https://cgps.gitbook.io/pathogenwatch/report-an-issue">here</a> and
            include the URL from the address bar of your browser.</p>
          <a className="mdl-button" onClick={this.goBack} href="#">Go back</a>
        </div>
      </div>
    );
  },

}));
