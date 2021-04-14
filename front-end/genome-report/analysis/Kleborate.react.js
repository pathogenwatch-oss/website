import React from 'react';

import ExternalLink from '../ExternalLink.react';

export default ({ genome }) => {
  const { kleborate, speciator } = genome.analysis;
  const species = !kleborate.species.replace('Klebsiella (Raoultella)', 'Raoultella').startsWith(speciator.speciesName);

  return (
    <React.Fragment>
      <header className="pw-genome-report-section-header">
        <h2>Kleborate</h2>
        <p>
          <a href="https://github.com/katholt/Kleborate" target="_blank" rel="noopener">
            https://github.com/katholt/Kleborate - version {kleborate['Kleborate version']}
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
