/* global localforage */

import React from 'react';

import CookieConsent from '@cgps/libmicroreact/cookie-consent';

const flag = 'cookie-consent-given';

const Cookies = React.createClass({

  getInitialState() {
    return {
      checked: false,
      consented: false,
    };
  },

  componentWillMount() {
    localforage.getItem(flag)
      .then(consented => {
        this.setState({ checked: true, consented });
      });
  },

  onAccept() {
    localforage.setItem(flag, true)
      .then(() => this.setState({ consented: true }));
  },

  render() {
    if (!this.state.checked) return null;
    return (
      <CookieConsent
        visible={!this.state.consented}
        onAccept={this.onAccept}
        appName="Pathogenwatch"
        theme="purple"
        policyLink={
          <a
            target="_blank"
            rel="noopener"
            href="https://cgps.gitbook.io/pathogenwatch/privacy-and-tos"
            className="mdl-button"
          >
            Read our policy
          </a>
        }
      />
    );
  },

});

export default Cookies;
