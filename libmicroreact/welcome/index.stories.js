import React from 'react';

import './styles.css';

import libmrLogo from '../static/libmicroreact.svg';
import cgpsLogo from '../static/cgps.svg';

export default {
  title: 'Welcome',
};

export const ToLibmicroreact = () => (
  <div className="libmr-welcome">
    <img className="libmr-welcome-logo" src={libmrLogo} alt="Libmicroreact" />
    <h1>
      <strong>Reusable components</strong> for
      <br />
      <strong>interactive visualisation</strong>
      <br />
      on the web.
    </h1>
    <p className="libmr-welcome-ownership">
      A component library by the
      <a href="https://www.pathogensurveillance.net" target="_blank" rel="noopener">
        <img src={cgpsLogo} alt="Centre for Genomic Pathogen Surveillance" />
      </a>
    </p>
  </div>
);

ToLibmicroreact.story = {
  name: 'to <LibMicroreact />',
};
