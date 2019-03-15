import React from 'react';

export default ({ result }) => (
  <React.Fragment>
    <header className="pw-genome-report-section-header flex">
      <h2>Serotype</h2>
      <a
        href="http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0147101"
        target="_blank"
        rel="noopener"
      >
        <em>Salmonella In Silico</em> Typing Resource (SISTR)
      </a>
    </header>
    <div className="pw-genome-report-metadata inline">
      <dt>Serovar</dt>
      <dd>{result.serovar}</dd>
    </div>
  </React.Fragment>
);
