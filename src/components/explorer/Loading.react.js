import '../../css/loading.css';
import '../../css/progress-bar.css';

import React from 'react';

import Spinner from '^/components/Spinner.react';

import { CGPS } from '^/defaults';

const backgroundStyle = {
  background: CGPS.COLOURS.GREY_LIGHT,
};

const Background = ({ children }) => (
  <main style={backgroundStyle} className="wgsa-loading-container">
    <img src="/assets/img/WGSA.FINAL.svg" className="wgsa-loading-logo"/>
    { children }
  </main>
);

export const LoadSpinner = React.createClass({

  displayName: 'LoadSpinner',

  render() {
    return (
      <Background>
        <Spinner />
        <h1>Loading collection...</h1>
      </Background>
    );
  },

});

export const LoadError = () => (
  <Background>
    <h1>This collection is currently unavailable.</h1>
    <p>Please try again later, or contact <a href="mailto:cgps@sanger.ac.uk">cgps@sanger.ac.uk</a> if problems persist.</p>
  </Background>
);
