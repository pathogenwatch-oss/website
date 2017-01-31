import React from 'react';

import RemoveButton from './RemoveButton.react';
import RetryButton from './RetryButton.react';

import { genomeValidationErrors as errors } from '../utils/validation';

const Footer = ({ children }) => (
  <footer className="wgsa-card-footer wgsa-card-footer--visible">
    { children }
  </footer>
);

export default (file) => {
  switch (file.error) {
    case errors.INVALID_GENOME_CONTENT:
    case errors.INVALID_GENOME_SIZE:
    case errors.EMPTY_FILE:
      return (
        <Footer>
          <RemoveButton name={file.name} primary />
        </Footer>
      );
    default:
      return (
        <Footer>
          <RetryButton file={file} />
          <RemoveButton name={file.name} className="wgsa-icon-button--small" />
        </Footer>
      );
  }
};
