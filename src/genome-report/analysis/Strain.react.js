import React from 'react';

export default ({ result }) => (
  <React.Fragment>
    <header className="pw-genome-report-section-header">
      <h2>Strain</h2>
      <a href="https://www.pneumogen.net/gps/">
        The Global Pneumococcal Sequencing Project
      </a>
    </header>
    <dl className="pw-genome-report-unsized">
      <div className="pw-genome-report-metadata">
        <dt>GPSC</dt>
        <dd>{result.strain}</dd>
      </div>
    </dl>
  </React.Fragment>
);
