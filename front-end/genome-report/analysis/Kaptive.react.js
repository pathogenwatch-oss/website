import React from 'react';

import ExternalLink from '../ExternalLink.react';

export default ({ genome }) => {
  const { kaptive, speciator } = genome.analysis;

  return (
    <React.Fragment>
      <header className="pw-genome-report-section-header">
        <h2>Capsule (K) and OC serotype predictions</h2>
        <p>
          <a href="https://github.com/katholt/Kaptive/wiki/Interpreting-the-results" target="_blank" rel="noopener">
          Sourced from Kaptive
          </a>
        </p>
      </header>
      <dl className="grid">
        <div className="pw-genome-report-metadata">
          <dt>K locus</dt>
          <dd>{kaptive.kLocus['Best match locus']}</dd>
          <ExternalLink
            to={`/genomes/all?organismId=${speciator.organismId}&klocusKaptive=${kaptive.kLocus['Best match locus']}`}
          >
            View all {kaptive.kLocus['Best match locus']}
          </ExternalLink>
        </div>
        <div className="pw-genome-report-metadata">
          <dt>Predicted capsule type</dt>
          <dd>{kaptive.kLocus['Best match type']}</dd>
        </div>
        <div className="pw-genome-report-metadata">
          <dt>Confidence</dt>
          <dd>{kaptive.kLocus['Match confidence']}</dd>
        </div>
      </dl>
      <dl className="grid">
        <div className="pw-genome-report-metadata">
          <dt>OC locus</dt>
          <dd>{kaptive.oLocus['Best match locus']}</dd>
          <ExternalLink
            to={`/genomes/all?organismId=${speciator.organismId}&olocusKaptive=${kaptive.oLocus['Best match locus']}`}
          >
            View all {kaptive.oLocus['Best match locus']}
          </ExternalLink>
        </div>
        <div className="pw-genome-report-metadata">
          <dt>Confidence</dt>
          <dd>{kaptive.oLocus['Match confidence']}</dd>
        </div>
      </dl>
    </React.Fragment>
  );
};
