import React from 'react';
import Clustering from '../../../clustering';

export default ({ result }) => (
  <React.Fragment>
    <header className="pw-genome-report-section-header">
      <h2>Core Genome Clustering</h2>
      <a href={result.scheme} target="_blank" rel="noopener">{result.scheme}</a>
    </header>
    <Clustering />
  </React.Fragment>
);
