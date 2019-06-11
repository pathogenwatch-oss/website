import React from 'react';

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
        <a href="https://github.com/katholt/Kleborate" target="_blank"
          rel="noopener"
        >https://github.com/katholt/Kleborate</a>
      </header>
      <dl>
        <div className="pw-genome-report-metadata">
          <dt>K Locus (<em>wzi</em>)</dt>
          <dd>{kleborate.K_locus} ({kleborate.wzi})</dd>
        </div>
        <div className="pw-genome-report-metadata">
          <dt>Confidence</dt>
          <dd>{kleborate.K_locus_confidence}</dd>
        </div>
      </dl>
      <dl>
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
