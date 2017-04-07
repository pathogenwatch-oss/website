import React from 'react';

import RemoveButton from './RemoveButton.react';
import RetryButton from './RetryButton.react';

import { InvalidGenomeError } from '../utils/validation';

const Footer = ({ children }) => (
  <footer className="wgsa-card-footer wgsa-card-footer--visible">
    { children }
  </footer>
);

export default ({ genome }) => {
  if (genome.error instanceof InvalidGenomeError) {
    return (
      <Footer>
        <RemoveButton genome={genome} primary />
      </Footer>
    );
  }
  return (
    <Footer>
      {/* <RetryButton genome={genome} /> */}
      <RemoveButton genome={genome} className="wgsa-icon-button--small" />
    </Footer>
  );
};
