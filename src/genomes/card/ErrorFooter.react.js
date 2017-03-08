import React from 'react';

import RemoveButton from './RemoveButton.react';
import RetryButton from './RetryButton.react';

import { genomeValidationErrors as errors } from '../utils/validation';

const Footer = ({ children }) => (
  <footer className="wgsa-card-footer wgsa-card-footer--visible">
    { children }
  </footer>
);

export default ({ genome }) => {
  switch (genome.error) {
    case errors.INVALID_GENOME_CONTENT:
    case errors.INVALID_GENOME_SIZE:
    case errors.EMPTY_FILE:
      return (
        <Footer>
          <RemoveButton genome={genome} primary />
        </Footer>
      );
    default:
      return (
        <Footer>
          <RetryButton genome={genome} />
          <RemoveButton genome={genome} className="wgsa-icon-button--small" />
        </Footer>
      );
  }
};
