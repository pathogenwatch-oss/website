import React from 'react';

import ExternalLink from '../ExternalLink.react';

// const kleborateTypingFields1 = [
//   'species',
//   'virulence_score',
//   'resistance_score',
//   'K_locus',
//   'K_locus_confidence',
//   'O_locus',
//   'O_locus_confidence',
//   'wzi',
// ];

export default ({ genome }) => {
  const { kleborate } = genome.analysis;
  const species = kleborate.species !== genome.analysis.speciator.speciesName;

  return (
    <React.Fragment>
      <header className="pw-genome-report-section-header">
        <h2>Kleborate</h2>
        <p>
          <a href="https://github.com/katholt/Kleborate" target="_blank" rel="noopener">
            https://github.com/katholt/Kleborate
          </a>
        </p>
      </header>
      <dl className="grid">
        <div className="pw-genome-report-metadata">
          <dt>K Locus</dt>
          <dd>{kleborate.K_locus}</dd>
          <ExternalLink to={`/genomes/all?genusId=570&klocus=${kleborate.K_locus}`}>
            View all {kleborate.K_locus}
          </ExternalLink>
        </div>
        <div className="pw-genome-report-metadata">
          <dt>Confidence</dt>
          <dd>{kleborate.K_locus_confidence}</dd>
        </div>
        <div className="pw-genome-report-metadata">
          <dt><em>wzi</em></dt>
          <dd>{kleborate.wzi}</dd>
        </div>
      </dl>
      <dl className="grid">
        <div className="pw-genome-report-metadata">
          <dt>O Locus</dt>
          <dd>{kleborate.O_locus}</dd>
        </div>
        <div className="pw-genome-report-metadata">
          <dt>Confidence</dt>
          <dd>{kleborate.O_locus_confidence}</dd>
        </div>
      </dl>
      {species &&
        <dl className="pw-genome-report-unsized">
          <div className="pw-genome-report-metadata">
            <dt className="danger">Species</dt>
            <dd>{kleborate.species}</dd>
          </div>
        </dl>
      }
    </React.Fragment>
  );
};
