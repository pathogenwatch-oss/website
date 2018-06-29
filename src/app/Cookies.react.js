/* global localforage */

import 'libmicroreact/src/cookie-consent/CookieConsent.css';

import React from 'react';

import CookieConsent from 'libmicroreact/src/cookie-consent/CookieConsent.react';

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

  onClose() {
    localforage.setItem(flag, true)
      .then(() => this.setState({ consented: true }));
  },

  render() {
    if (!this.state.checked) return null;
    return (
      <CookieConsent
        visible={!this.state.consented}
        onClose={this.onClose}
        appName="Pathogenwatch"
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
