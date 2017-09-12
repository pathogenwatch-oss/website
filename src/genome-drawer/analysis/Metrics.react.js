import React from 'react';

import { Section, Metadata } from '../components';

import N50Chart from './N50Chart.react';

export default ({ result }) => (
  <div>
    <dl>
      <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
        <dt className="wgsa-hub-stats-heading">Genome Length</dt>
        <dd className="wgsa-hub-stats-value">{result.length}</dd>
      </span>
      <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
        <dt className="wgsa-hub-stats-heading">No. Contigs</dt>
        <dd className="wgsa-hub-stats-value">{result.contigs}</dd>
      </span>
      <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
        <dt className="wgsa-hub-stats-heading">Smallest Contig</dt>
        <dd className="wgsa-hub-stats-value">{result.smallestContig}</dd>
      </span>
      <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
        <dt className="wgsa-hub-stats-heading">Largest Contig</dt>
        <dd className="wgsa-hub-stats-value">{result.largestContig}</dd>
      </span>
      <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
        <dt className="wgsa-hub-stats-heading">Average Contig Length</dt>
        <dd className="wgsa-hub-stats-value">{result.averageContig}</dd>
      </span>
      <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
        <dt className="wgsa-hub-stats-heading">N50</dt>
        <dd className="wgsa-hub-stats-value">{result.N50}</dd>
      </span>
      <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
        <dt className="wgsa-hub-stats-heading">Non-ATCG</dt>
        <dd className="wgsa-hub-stats-value">{result.nonATCG}</dd>
      </span>
      <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
        <dt className="wgsa-hub-stats-heading">GC Content</dt>
        <dd className="wgsa-hub-stats-value">{result.gcContent}%</dd>
      </span>
    </dl>
    <Section heading="N50 chart">
      <N50Chart metrics={result} />
    </Section>
  </div>
);
