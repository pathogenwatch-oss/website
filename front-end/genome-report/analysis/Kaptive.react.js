import React from 'react';

import ExternalLink from '../ExternalLink.react';

export default ({ genome }) => {
  const { kaptive, speciator, kleborate } = genome.analysis;

  return (
    <React.Fragment>
      <header className="pw-genome-report-section-header">
        <h2>Surface polysaccharide typing</h2>
        <p>
          <a href="https://kaptive.readthedocs.io/en/latest/Interpreting-the-results.html" target="_blank"
             rel="noopener">
            Sourced from Kaptive
          </a>
        </p>
      </header>
      <dl className="grid">
        <div className="pw-genome-report-metadata">
          <dt>{ kaptive.kLocus.name }</dt>
          <dd>{ kaptive.kLocus['Best match locus'] }</dd>
          <ExternalLink
            to={ `/genomes/all?organismId=${speciator.organismId}&klocusKaptive=${kaptive.kLocus['Best match locus']}` }
          >
            View all { kaptive.kLocus['Best match locus'] }
          </ExternalLink>
        </div>
        <div className="pw-genome-report-metadata">
          <dt>Predicted capsule type</dt>
          <dd>{ kaptive.kLocus['Best match type'] }</dd>
        </div>
        <div className="pw-genome-report-metadata">
          <dt>Confidence</dt>
          <dd>{ kaptive.kLocus['Match confidence'] }</dd>
        </div>
        { !!kleborate && !!kleborate.wzi && (
          <div className="pw-genome-report-metadata">
            <dt>wzi</dt>
            <dd>{ kleborate.wzi }</dd>
          </div>
        ) }
      </dl>
      <dl className="grid">
        <div className="pw-genome-report-metadata">
          <dt>{ kaptive.oLocus.name }</dt>
          <dd>{ kaptive.oLocus['Best match locus'] }</dd>
          <ExternalLink
            to={ `/genomes/all?organismId=${speciator.organismId}&olocusKaptive=${kaptive.oLocus['Best match locus']}` }
          >
            View all { kaptive.oLocus['Best match locus'] }
          </ExternalLink>
        </div>
        <div className="pw-genome-report-metadata">
          <dt>Predicted { kaptive.oLocus.name } type</dt>
          <dd>{ kaptive.oLocus['Best match type'] }</dd>
        </div>
        <div className="pw-genome-report-metadata">
          <dt>Confidence</dt>
          <dd>{ kaptive.oLocus['Match confidence'] }</dd>
        </div>
      </dl>
    </React.Fragment>
  );
};
