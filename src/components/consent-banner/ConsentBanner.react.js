import React from 'react';
import classnames from 'classnames';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default React.createClass({

  getInitialState() {
    return {
      consent: cookies.get('consent'),
    };
  },

  onClick() {
    cookies.set('consent', true, { path: '/' });
    this.setState({ consent: true });
  },

  render() {
    const { consent } = this.state;

    if (this.state.consent) {
      return null;
    }

    return (
      <div className="wgsa-consent-banner">
        <span>🍪</span>
        <div>
          This website uses cookies to offer you a better browsing experience.
          {}
        </div>
        <button
          className="mdl-button mdl-button--raised mdl-button--colored"
          onClick={this.onClick}
        >
          I agree
        </button>
      </div>
    );
  },

});
