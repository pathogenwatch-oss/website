import React from 'react';
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
          That's ok
        </button>
      </div>
    );
  },

});
