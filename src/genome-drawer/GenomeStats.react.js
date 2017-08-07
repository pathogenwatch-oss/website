import React from 'react';

export default ({ metrics }) => (
  <dl className="wgsa-hub-stats-view">
    <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
      <dt className="wgsa-hub-stats-heading">Genome Length</dt>
      <dd className="wgsa-hub-stats-value">{metrics.length}</dd>
    </span>
    <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
      <dt className="wgsa-hub-stats-heading">No. Contigs</dt>
      <dd className="wgsa-hub-stats-value">{metrics.contigs}</dd>
    </span>
    <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
      <dt className="wgsa-hub-stats-heading">Smallest Contig</dt>
      <dd className="wgsa-hub-stats-value">{metrics.smallestContig}</dd>
    </span>
    <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
      <dt className="wgsa-hub-stats-heading">Largest Contig</dt>
      <dd className="wgsa-hub-stats-value">{metrics.largestContig}</dd>
    </span>
    <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
      <dt className="wgsa-hub-stats-heading">Average Contig Length</dt>
      <dd className="wgsa-hub-stats-value">{metrics.averageContig}</dd>
    </span>
    <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
      <dt className="wgsa-hub-stats-heading">N50</dt>
      <dd className="wgsa-hub-stats-value">{metrics.N50}</dd>
    </span>
    <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
      <dt className="wgsa-hub-stats-heading">Non-ATCG</dt>
      <dd className="wgsa-hub-stats-value">{metrics.nonATCG}</dd>
    </span>
    <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
      <dt className="wgsa-hub-stats-heading">GC Content</dt>
      <dd className="wgsa-hub-stats-value">{metrics.gcContent}%</dd>
    </span>
  </dl>
);
