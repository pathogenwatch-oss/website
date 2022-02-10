import React from 'react';

import ExternalLink from '../ExternalLink.react';

export default ({ genome }) => {
  const { kleborate, speciator } = genome.analysis;
  const species = !speciator.speciesName.replace('Raoultella', 'Klebsiella').startsWith(kleborate.species);

  // TODO: Remove the version check.
  return (
    <React.Fragment>
      <header className="pw-genome-report-section-header">
        <h2>Capsule (K) and O serotype predictions</h2>
        <p>
          <a href="https://github.com/katholt/Kaptive/wiki/Interpreting-the-results" target="_blank" rel="noopener">
          Sourced from Kaptive
          </a>
        </p>
      </header>
      <dl className="grid">
        <div className="pw-genome-report-metadata">
          <dt>K locus</dt>
          <dd>{kleborate.typing.K_locus}</dd>
          <ExternalLink to={`/genomes/all?genusId=${speciator.genusId}&klocus=${kleborate.typing.K_locus}`}>
            View all {kleborate.typing.K_locus}
          </ExternalLink>
        </div>
        {'K_type' in kleborate.typing && (<div className="pw-genome-report-metadata">
          <dt>Predicted capsule type</dt>
          <dd>{kleborate.typing.K_type}</dd>
        </div>)}
        <div className="pw-genome-report-metadata">
          <dt>Confidence</dt>
          <dd>{kleborate.typing.K_locus_confidence}</dd>
        </div>
        <div className="pw-genome-report-metadata">
          <dt><em>wzi</em></dt>
          <dd>{kleborate.typing.wzi}</dd>
        </div>
      </dl>
      <dl className="grid">
        <div className="pw-genome-report-metadata">
          <dt>O locus</dt>
          <dd>{kleborate.typing.O_locus}</dd>
          <ExternalLink to={`/genomes/all?genusId=${speciator.genusId}&olocus=${kleborate.typing.O_locus}`}>
            View all {kleborate.typing.O_locus}
          </ExternalLink>
        </div>
        {'O_type' in kleborate.typing && kleborate.__v === 'v2.3.0' &&
          (<div className="pw-genome-report-metadata">
            <dt>Predicted O type</dt>
            <dd>{kleborate.typing.O_type}</dd>
          </div>)}
        <div className="pw-genome-report-metadata">
          <dt>Confidence</dt>
          <dd>{kleborate.typing.O_locus_confidence}</dd>
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
