import React from 'react';
// import classnames from 'classnames';

import Drawer from '../drawer';

const AssemblyStats = ({ assembly: { metrics } }) => (
  <dl className="wgsa-assembly-drawer-content wgsa-hub-stats-view">
    <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
      <dt className="wgsa-hub-stats-heading">Assembly Length</dt>
      <dd className="wgsa-hub-stats-value">{metrics.totalNumberOfNucleotidesInDnaStrings}</dd>
    </span>
    <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
      <dt className="wgsa-hub-stats-heading">No. Contigs</dt>
      <dd className="wgsa-hub-stats-value">{metrics.totalNumberOfContigs}</dd>
    </span>
    <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
      <dt className="wgsa-hub-stats-heading">Smallest Contig</dt>
      <dd className="wgsa-hub-stats-value">{metrics.smallestNumberOfNucleotidesInDnaStrings}</dd>
    </span>
    <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
      <dt className="wgsa-hub-stats-heading">Largest Contig</dt>
      <dd className="wgsa-hub-stats-value">{metrics.biggestNumberOfNucleotidesInDnaStrings}</dd>
    </span>
    <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
      <dt className="wgsa-hub-stats-heading">Average Contig Length</dt>
      <dd className="wgsa-hub-stats-value">{metrics.averageNumberOfNucleotidesInDnaStrings}</dd>
    </span>
    <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
      <dt className="wgsa-hub-stats-heading">N50</dt>
      <dd className="wgsa-hub-stats-value">{metrics.contigN50}</dd>
    </span>
    <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
      <dt className="wgsa-hub-stats-heading">Non-ATCG</dt>
      <dd className="wgsa-hub-stats-value">{metrics.totalNumberOfNsInDnaStrings}</dd>
    </span>
    <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
      <dt className="wgsa-hub-stats-heading">GC Content</dt>
      <dd className="wgsa-hub-stats-value">{metrics.gcContent}%</dd>
    </span>
  </dl>
);


export default ({ assembly, onClose, ...props }) => (
  <Drawer
    {...props}
    isOpen
    onClose={onClose}
  >
    { assembly && <AssemblyStats assembly={assembly} /> }
  </Drawer>
);
